from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from django.conf import settings
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

@method_decorator(csrf_exempt, name="dispatch")
class PaymentIPN(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        tran_id = request.data.get("tran_id")
        val_id  = request.data.get("val_id")
        status_str = (request.data.get("status") or "").upper()

        pay = get_object_or_404(Payment, meta__tran_id=tran_id)
        pay.meta.update({"ipn": request.data})

        # Only treat paid when validator says VALID/VALIDATED
        if val_id:
            try:
                v = validate_with_val_id(val_id)
            except Exception as e:
                pay.meta.update({"ipn_validation_error": str(e)})
                pay.save(update_fields=["meta"])
                return Response({"ok": False}, status=502)

            pay.gateway_trx_id = v.get("val_id", "")
            pay.meta.update({"validation": v})
            if (v.get("status") or "").upper() in ("VALID", "VALIDATED"):
                if str(v.get("risk_level")) == "1":
                    # keep on hold if you add that state later
                    pass
                else:
                    pay.status = PaymentStatus.SUCCESS
            else:
                pay.status = PaymentStatus.FAILED
        else:
            # fallback if gateway sent FAILED without val_id
            if status_str == "FAILED":
                pay.status = PaymentStatus.FAILED

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

# ------- Browser redirects from SSLCommerz --------

@method_decorator(csrf_exempt, name="dispatch")
class SSLSuccess(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):  # SSLCommerz POSTS here
        val_id = request.data.get("val_id")
        tran_id = request.data.get("tran_id")
        if not val_id or not tran_id:
            return Response({"detail": "Missing val_id/tran_id"}, status=400)

        # Load payment by tran_id saved in meta
        pay = get_object_or_404(Payment, meta__tran_id=tran_id)

        # Validate with validator API
        try:
            v = validate_with_val_id(val_id)
        except Exception as e:
            return Response({"detail": "Validation failed", "error": str(e)}, status=502)

        status_text = (v.get("status") or "").upper()  # "VALID", "VALIDATED", etc.
        pay.gateway_trx_id = v.get("val_id", "")
        pay.meta.update({"success_post": request.data, "validation": v})

        if status_text in ("VALID", "VALIDATED"):
            # risk_level=1 → hold for manual review
            if str(v.get("risk_level")) == "1":
                # keep as INIT or custom "ON_HOLD" if you extend enum
                pass
            else:
                pay.status = PaymentStatus.SUCCESS
        else:
            pay.status = PaymentStatus.FAILED

        pay.save()

        # Redirect the user to frontend success page with a tokenized reference
        return redirect(f"{settings.FRONTEND_URL}/payments/success?ref={tran_id}")


@method_decorator(csrf_exempt, name="dispatch")
class SSLFail(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        tran_id = request.data.get("tran_id")
        pay = Payment.objects.filter(meta__tran_id=tran_id).first()
        if pay:
            pay.status = PaymentStatus.FAILED
            pay.meta.update({"fail_post": request.data})
            pay.save()
        return redirect(f"{settings.FRONTEND_URL}/payments/fail?ref={tran_id or ''}")


@method_decorator(csrf_exempt, name="dispatch")
class SSLCancel(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        tran_id = request.data.get("tran_id")
        pay = Payment.objects.filter(meta__tran_id=tran_id).first()
        if pay:
            pay.meta.update({"cancel_post": request.data})
            pay.save()
        return redirect(f"{settings.FRONTEND_URL}/payments/cancel?ref={tran_id or ''}")