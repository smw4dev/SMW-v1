# payments/views.py
from decimal import Decimal, InvalidOperation

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer
from .services import SSLCommerzClient


def _flatten_data(data):
    """
    Convert DRF's request.data / QueryDict into a plain {str: str} dict safely.
    Works for application/x-www-form-urlencoded and JSON bodies.
    """
    # Try QueryDict.dict() first (exists for form data)
    try:
        return data.dict()
    except AttributeError:
        pass
    # Fallback: DRF's dict-like (values might be lists)
    flat = {}
    for k, v in data.items():
        # Most DRF parsers already give scalar values here
        if isinstance(v, (list, tuple)) and v:
            flat[k] = v[0]
        else:
            flat[k] = v
    return flat


@method_decorator(csrf_exempt, name="dispatch")
class AdmissionPaymentCreate(APIView):
    """
    Public endpoint to initiate a payment for an admission application.
    Returns a Payment record and SSLCommerz GatewayPageURL.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, application_id: int):
        body = _flatten_data(request.data)

        # WARNING (prod): don't trust client-supplied amount; compute server-side instead.
        amount_str = body.get("amount", "500.00")
        try:
            amount = Decimal(amount_str)
        except (InvalidOperation, TypeError):
            return Response({"detail": "invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        currency = body.get("currency", "BDT")

        customer = {
            "name":     body.get("cus_name") or "Customer",
            "email":    body.get("cus_email") or "customer@example.com",
            "phone":    body.get("cus_phone") or "01700000000",
            "address":  body.get("cus_add1") or "N/A",
            "city":     body.get("cus_city") or "Dhaka",
            "postcode": body.get("cus_postcode") or "1200",
            "country":  body.get("cus_country") or "Bangladesh",
        }

        client = SSLCommerzClient()
        try:
            tran_id, create_payload, gw_resp = client.start_payment(
                amount=amount, currency=currency, customer=customer, product_name="Admission Fee"
            )
        except Exception as e:
            return Response(
                {"detail": "SSLCommerz init error", "error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        pay = Payment.objects.create(
            tran_id=tran_id,
            amount=amount,
            currency=currency,
            created_by=None,                # public endpoint → no user
            application_id=application_id,
            status=PaymentStatus.REDIRECTED,
            create_payload=create_payload,
            gateway_response=gw_resp,
        )

        if gw_resp.get("status") != "SUCCESS" or not gw_resp.get("GatewayPageURL"):
            pay.mark(PaymentStatus.FAILED)
            return Response(
                {"detail": "SSLCommerz init failed", "gateway_response": gw_resp},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "payment": PaymentSerializer(pay).data,
                "GatewayPageURL": gw_resp["GatewayPageURL"],
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SSLSuccessView(APIView):
    """
    Browser will be redirected here by SSLCommerz on success.
    We mark SUCCESS_REDIRECT and (optionally) validate immediately if val_id is present.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")
        val_id = data.get("val_id")

        if not tran_id:
            return Response({"detail": "tran_id missing"}, status=400)

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)

        # Save raw posted fields
        pay.gateway_response = data
        pay.status = PaymentStatus.SUCCESS_REDIRECT
        pay.save(update_fields=["gateway_response", "status"])

        # Try immediate validation if val_id present
        if val_id:
            try:
                v = SSLCommerzClient().validate(val_id=val_id)
                pay.validation_response = v
                status_flag = v.get("status")  # "VALID", "VALIDATED", "FAILED", etc.
                if status_flag in {"VALID", "VALIDATED"}:
                    pay.mark(PaymentStatus.VALIDATED)
                elif status_flag == "FAILED":
                    pay.mark(PaymentStatus.FAILED)
                pay.save(update_fields=["validation_response", "status"])
            except Exception:
                # It's okay if this fails; IPN should arrive and finalize later.
                pass

        return Response(
            {"detail": "success received", "tran_id": tran_id, "val_id": val_id, "status": pay.status},
            status=200,
        )

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLFailView(APIView):
    """
    Browser will be redirected here by SSLCommerz on failure (e.g., declined).
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay:
            pay.gateway_response = data
            pay.mark(PaymentStatus.FAIL_REDIRECT)
            pay.save(update_fields=["gateway_response", "status"])

        return Response({"detail": "fail received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLCancelView(APIView):
    """
    Browser will be redirected here by SSLCommerz when user cancels.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay:
            pay.gateway_response = data
            pay.mark(PaymentStatus.CANCEL_REDIRECT)
            pay.save(update_fields=["gateway_response", "status"])

        return Response({"detail": "cancel received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLIPNView(APIView):
    """
    Server-to-server IPN from SSLCommerz. This is the authoritative status.
    We call the validator API using val_id and finalize the Payment status.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")
        val_id = data.get("val_id")

        if not (tran_id and val_id):
            return Response({"detail": "tran_id and val_id required"}, status=400)

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)

        try:
            v = SSLCommerzClient().validate(val_id=val_id)
        except Exception as e:
            # If validator is temporarily unavailable, keep previous status but record the event
            return Response({"detail": "validation error", "error": str(e)}, status=502)

        pay.validation_response = v
        status_flag = v.get("status")  # "VALID" / "VALIDATED" / "FAILED" / "EXPIRED" / etc.

        if status_flag in {"VALID", "VALIDATED"}:
            pay.mark(PaymentStatus.VALIDATED)
        elif status_flag == "FAILED":
            pay.mark(PaymentStatus.FAILED)
        else:
            # Could be EXPIRED / unknown; keep existing status but persist payload
            pay.save(update_fields=["validation_response"])

        pay.save(update_fields=["validation_response", "status"])
        return Response({"detail": "ipn processed", "tran_id": tran_id, "status": pay.status}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class PaymentDetailByTranId(APIView):
    """
    Public read-only endpoint to check a payment by tran_id.
    Useful for Postman/manual verification. Remove or restrict in production.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, tran_id: str):
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)
        return Response(PaymentSerializer(pay).data, status=200)
