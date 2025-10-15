from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer
from admissions.models import AdmissionApplication

ADMISSION_FEE_DEFAULT = 500.00  # BDT; change as needed or read from settings/env

class AdmissionPaymentCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, application_id):
        app = get_object_or_404(AdmissionApplication, pk=application_id)
        # Admin/staff can create payment for any; student can create for own created_user
        if not (request.user.is_superuser or request.user.is_staff or app.created_user == request.user):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        data = {
            "purpose": "ADMISSION_FEE",
            "application": app.id,
            "user": request.user.id if request.user.is_authenticated else None,
            "amount": float(request.data.get("amount") or ADMISSION_FEE_DEFAULT),
            "currency": "BDT",
            "method": request.data.get("method","SSLC"),
        }
        s = PaymentSerializer(data=data)
        if s.is_valid():
            pay = s.save()
            # TODO: initiate SSLCommerz and store redirect URL / trx data in pay.meta
            return Response(PaymentSerializer(pay).data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentIPN(APIView):
    permission_classes = [permissions.AllowAny]  # gateway posts here
    def post(self, request):
        # TODO: verify HMAC/signature from SSLCommerz in production
        trx = request.data.get("tran_id")
        status_str = request.data.get("status")  # "VALID" / "FAILED"
        pay = get_object_or_404(Payment, meta__tran_id=trx)
        if status_str == "VALID":
            pay.status = PaymentStatus.SUCCESS
            pay.gateway_trx_id = request.data.get("val_id","")
        else:
            pay.status = PaymentStatus.FAILED
        pay.meta.update(request.data)
        pay.save()
        return Response({"ok": True})

class MyPayments(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        if request.user.is_superuser or request.user.is_staff:
            qs = Payment.objects.all().order_by("-id")
        else:
            qs = Payment.objects.filter(user=request.user).order_by("-id")
        return Response(PaymentSerializer(qs, many=True).data)
