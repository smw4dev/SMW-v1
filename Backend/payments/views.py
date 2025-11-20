# Backend/payments/views.py


from decimal import Decimal, InvalidOperation  # noqa: F401

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer
from .services import SSLCommerzClient
from .signals import payment_validated

from admissions.models import AdmissionApplication, SeatHold, SeatHoldStatus
from courses_app.models import Batch

# Fixed fee enforced server-side
FIXED_ADMISSION_FEE = Decimal(str(getattr(settings, "ADMISSION_FEE_BDT", "4625.00")))
HOLD_MINUTES = int(getattr(settings, "SEAT_HOLD_MINUTES", 10))


def _flatten_data(data):
    """
    Convert DRF's request.data / query_params / QueryDict into a plain dict[str, str].
    Safe for both form-url-encoded and JSON bodies.
    """
    try:
        return data.dict()
    except AttributeError:
        pass
    flat = {}
    for k, v in data.items():
        if isinstance(v, (list, tuple)) and v:
            flat[k] = v[0]
        else:
            flat[k] = v
    return flat


def _finalize_on_validation(pay: Payment, validation: dict) -> bool:
    """
    Apply validation result and, if everything matches, mark payment as VALIDATED
    and fire `payment_validated`.

    Returns True if we transitioned to VALIDATED on this call, False otherwise.
    """
    if pay.status == PaymentStatus.VALIDATED:
        return False

    status_str = (validation.get("status") or "").upper()
    risk = str(validation.get("risk_level", "0"))
    try:
        amount = Decimal(str(validation.get("amount", "0")))
    except Exception:
        amount = Decimal("0")
    currency = (validation.get("currency") or "").upper()

    # Basic checks – adjust to match the exact SSLCommerz payload you see
    if status_str not in {"VALID", "VALIDATED"}:
        pay.mark(PaymentStatus.FAILED, save=False)
        return False

    if risk not in {"0", "LOW"}:
        pay.mark(PaymentStatus.FAILED, save=False)
        return False

    if amount != pay.amount or currency != (pay.currency or "").upper():
        pay.mark(PaymentStatus.FAILED, save=False)
        return False

    # All good → mark validated and emit signal
    pay.mark(PaymentStatus.VALIDATED, save=False)
    payment_validated.send(sender=Payment, payment=pay)
    return True


@method_decorator(csrf_exempt, name="dispatch")
class AdmissionPaymentCreate(APIView):
    """
    Public endpoint to initiate a payment:

      - Atomically create a seat HOLD if capacity allows
      - Create Payment (status REDIRECTED)
      - Start SSL session and return GatewayPageURL
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, application_id: int):
        # 1) Atomically place a short-lived hold
        with transaction.atomic():
            app = get_object_or_404(
                AdmissionApplication.objects.select_for_update(),
                pk=application_id,
            )
            batch = Batch.objects.select_for_update().get(pk=app.batch_id)

            # Expire overdue holds
            SeatHold.expire_overdue_now()
            active_holds = SeatHold.active_count_for_batch(batch.id)

            if batch.filled_seats + active_holds >= batch.total_seat:
                return Response(
                    {"detail": "Seats full for this batch."},
                    status=status.HTTP_409_CONFLICT,
                )

            hold = SeatHold.objects.create(
                application=app,
                batch=batch,
                expires_at=timezone.now()
                + timezone.timedelta(minutes=HOLD_MINUTES),
                status=SeatHoldStatus.HELD,
            )

            # Create db payment row
            pay = Payment.objects.create(
                tran_id=None,  # will be replaced after SSL session init
                amount=FIXED_ADMISSION_FEE,
                currency="BDT",
                created_by=None,
                application_id=application_id,
                status=PaymentStatus.REDIRECTED,
                create_payload={
                    "hold_token": hold.hold_token,
                    "application_id": application_id,
                },
                gateway_response={},
            )

        # 2) Call SSL outside the DB lock
        client = SSLCommerzClient()
        customer = {
            "name": (
                f"{app.student_first_name_en} {app.student_last_name_en}".strip()
                if app.student_first_name_en
                else "Student"
            ),
            "email": app.student_email or "student@example.com",
            "phone": app.student_mobile or "01700000000",
            "address": "N/A",
            "city": "Dhaka",
            "postcode": "1200",
            "country": "Bangladesh",
        }

        try:
            tran_id, create_payload, gw_resp = client.start_payment(
                amount=FIXED_ADMISSION_FEE,
                currency="BDT",
                customer=customer,
                product_name=f"Admission Fee - App #{application_id}",
            )
        except Exception as e:
            # Release the hold on any init error
            with transaction.atomic():
                h = (
                    SeatHold.objects.select_for_update()
                    .filter(
                        hold_token=hold.hold_token,
                        status=SeatHoldStatus.HELD,
                    )
                    .first()
                )
                if h:
                    h.status = SeatHoldStatus.CANCELLED
                    h.save(update_fields=["status"])
            return Response(
                {"detail": "SSLCommerz init error", "error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # 3) Save session and return URL
        pay.tran_id = tran_id
        cp = pay.create_payload or {}
        cp.update(create_payload or {})
        cp["hold_token"] = hold.hold_token
        cp["application_id"] = application_id
        pay.create_payload = cp
        pay.gateway_response = gw_resp
        pay.save(update_fields=["tran_id", "create_payload", "gateway_response"])

        return Response(
            {
                "tran_id": tran_id,
                "gateway_url": gw_resp.get("GatewayPageURL"),
                "status": "OK",
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SSLSuccessView(APIView):
    """
    Browser redirect endpoint after successful payment.

    We *do not* finalize the payment here; that is done in IPN after validation.
    Here we only record the hit and mark status=SUCCESS_REDIRECT if not already VALIDATED.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        raw = request.query_params if request.method == "GET" else request.data
        data = _flatten_data(raw)

        tran_id = data.get("tran_id")
        if not tran_id:
            return Response({"detail": "tran_id missing"}, status=400)

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)

        pay.gateway_response = data
        if pay.status != PaymentStatus.VALIDATED:
            pay.mark(PaymentStatus.SUCCESS_REDIRECT, save=False)
        pay.save(update_fields=["gateway_response", "status"])

        return Response(
            {"detail": "success received", "tran_id": tran_id, "status": pay.status},
            status=200,
        )

    def post(self, request, *args, **kwargs):
        return self._handle(request)

    def get(self, request, *args, **kwargs):
        return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLFailView(APIView):
    """
    Browser redirect endpoint when user fails payment.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        raw = request.query_params if request.method == "GET" else request.data
        data = _flatten_data(raw)

        tran_id = data.get("tran_id")
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay and pay.status != PaymentStatus.VALIDATED:
            pay.gateway_response = data
            pay.mark(PaymentStatus.FAIL_REDIRECT, save=False)
            pay.save(update_fields=["gateway_response", "status"])
            _release_hold_from_pay(pay)

        return Response(
            {
                "detail": "fail received",
                "tran_id": tran_id,
                "status": getattr(pay, "status", None),
            },
            status=200,
        )

    def post(self, request, *args, **kwargs):
        return self._handle(request)

    def get(self, request, *args, **kwargs):
        return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLCancelView(APIView):
    """
    Browser redirect endpoint when user cancels payment.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        raw = request.query_params if request.method == "GET" else request.data
        data = _flatten_data(raw)

        tran_id = data.get("tran_id")
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay and pay.status != PaymentStatus.VALIDATED:
            pay.gateway_response = data
            pay.mark(PaymentStatus.CANCEL_REDIRECT, save=False)
            pay.save(update_fields=["gateway_response", "status"])
            _release_hold_from_pay(pay)

        return Response(
            {
                "detail": "cancel received",
                "tran_id": tran_id,
                "status": getattr(pay, "status", None),
            },
            status=200,
        )

    def post(self, request, *args, **kwargs):
        return self._handle(request)

    def get(self, request, *args, **kwargs):
        return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLIPNView(APIView):
    """
    Server-to-server IPN endpoint from SSLCommerz.

    This is the only place we call the validation API and
    transition to VALIDATED → which then fires payment_validated.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")
        val_id = data.get("val_id")

        if not (tran_id and val_id):
            return Response({"detail": "tran_id and val_id required"}, status=400)

        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)

        try:
            validation = SSLCommerzClient().validate(val_id=val_id)
        except Exception as e:
            return Response(
                {"detail": "validation error", "error": str(e)},
                status=502,
            )

        pay.validation_response = validation
        _finalize_on_validation(pay, validation)
        pay.save(update_fields=["validation_response", "status"])

        return Response(
            {"detail": "ipn processed", "tran_id": tran_id, "status": pay.status},
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaymentDetailByTranId(APIView):
    """
    Public read-only endpoint to check a payment by tran_id.
    Useful for Postman/manual verification. Restrict/remove in production.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, tran_id: str):
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)
        return Response(PaymentSerializer(pay).data, status=200)


# ---------- helpers ----------


def _release_hold_from_pay(pay: Payment):
    """
    Cancel the SeatHold associated with this payment (if still HELD).
    Used when payment fails or user cancels.
    """
    token = None
    cp = pay.create_payload or {}
    if isinstance(cp, dict):
        token = cp.get("hold_token")
    if not token:
        return

    with transaction.atomic():
        h = (
            SeatHold.objects.select_for_update()
            .filter(hold_token=token, status=SeatHoldStatus.HELD)
            .first()
        )
        if h:
            h.status = SeatHoldStatus.CANCELLED
            h.save(update_fields=["status"])
