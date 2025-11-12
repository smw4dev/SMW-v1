# # payments/views.py
# from decimal import Decimal, InvalidOperation

# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import AllowAny

# from .models import Payment, PaymentStatus
# from .serializers import PaymentSerializer
# from .services import SSLCommerzClient


# def _flatten_data(data):
#     """
#     Convert DRF's request.data / QueryDict into a plain {str: str} dict safely.
#     Works for application/x-www-form-urlencoded and JSON bodies.
#     """
#     # Try QueryDict.dict() first (exists for form data)
#     try:
#         return data.dict()
#     except AttributeError:
#         pass
#     # Fallback: DRF's dict-like (values might be lists)
#     flat = {}
#     for k, v in data.items():
#         # Most DRF parsers already give scalar values here
#         if isinstance(v, (list, tuple)) and v:
#             flat[k] = v[0]
#         else:
#             flat[k] = v
#     return flat


# @method_decorator(csrf_exempt, name="dispatch")
# class AdmissionPaymentCreate(APIView):
#     """
#     Public endpoint to initiate a payment for an admission application.
#     Returns a Payment record and SSLCommerz GatewayPageURL.
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def post(self, request, application_id: int):
#         body = _flatten_data(request.data)

#         # WARNING (prod): don't trust client-supplied amount; compute server-side instead.
#         amount_str = body.get("amount", "500.00")
#         try:
#             amount = Decimal(amount_str)
#         except (InvalidOperation, TypeError):
#             return Response({"detail": "invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

#         currency = body.get("currency", "BDT")

#         customer = {
#             "name":     body.get("cus_name") or "Customer",
#             "email":    body.get("cus_email") or "customer@example.com",
#             "phone":    body.get("cus_phone") or "01700000000",
#             "address":  body.get("cus_add1") or "N/A",
#             "city":     body.get("cus_city") or "Dhaka",
#             "postcode": body.get("cus_postcode") or "1200",
#             "country":  body.get("cus_country") or "Bangladesh",
#         }

#         client = SSLCommerzClient()
#         try:
#             tran_id, create_payload, gw_resp = client.start_payment(
#                 amount=amount, currency=currency, customer=customer, product_name="Admission Fee"
#             )
#         except Exception as e:
#             return Response(
#                 {"detail": "SSLCommerz init error", "error": str(e)},
#                 status=status.HTTP_502_BAD_GATEWAY,
#             )

#         pay = Payment.objects.create(
#             tran_id=tran_id,
#             amount=amount,
#             currency=currency,
#             created_by=None,                # public endpoint → no user
#             application_id=application_id,
#             status=PaymentStatus.REDIRECTED,
#             create_payload=create_payload,
#             gateway_response=gw_resp,
#         )

#         if gw_resp.get("status") != "SUCCESS" or not gw_resp.get("GatewayPageURL"):
#             pay.mark(PaymentStatus.FAILED)
#             return Response(
#                 {"detail": "SSLCommerz init failed", "gateway_response": gw_resp},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         return Response(
#             {
#                 "payment": PaymentSerializer(pay).data,
#                 "GatewayPageURL": gw_resp["GatewayPageURL"],
#             },
#             status=status.HTTP_201_CREATED,
#         )


# @method_decorator(csrf_exempt, name="dispatch")
# class SSLSuccessView(APIView):
#     """
#     Browser will be redirected here by SSLCommerz on success.
#     We mark SUCCESS_REDIRECT and (optionally) validate immediately if val_id is present.
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def _handle(self, request):
#         data = _flatten_data(request.data)
#         tran_id = data.get("tran_id")
#         val_id = data.get("val_id")

#         if not tran_id:
#             return Response({"detail": "tran_id missing"}, status=400)

#         pay = Payment.objects.filter(tran_id=tran_id).first()
#         if not pay:
#             return Response({"detail": "payment not found"}, status=404)

#         # Save raw posted fields
#         pay.gateway_response = data
#         pay.status = PaymentStatus.SUCCESS_REDIRECT
#         pay.save(update_fields=["gateway_response", "status"])

#         # Try immediate validation if val_id present
#         if val_id:
#             try:
#                 v = SSLCommerzClient().validate(val_id=val_id)
#                 pay.validation_response = v
#                 status_flag = v.get("status")  # "VALID", "VALIDATED", "FAILED", etc.
#                 if status_flag in {"VALID", "VALIDATED"}:
#                     pay.mark(PaymentStatus.VALIDATED)
#                 elif status_flag == "FAILED":
#                     pay.mark(PaymentStatus.FAILED)
#                 pay.save(update_fields=["validation_response", "status"])
#             except Exception:
#                 # It's okay if this fails; IPN should arrive and finalize later.
#                 pass

#         return Response(
#             {"detail": "success received", "tran_id": tran_id, "val_id": val_id, "status": pay.status},
#             status=200,
#         )

#     def post(self, request): return self._handle(request)
#     def get(self, request):  return self._handle(request)


# @method_decorator(csrf_exempt, name="dispatch")
# class SSLFailView(APIView):
#     """
#     Browser will be redirected here by SSLCommerz on failure (e.g., declined).
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def _handle(self, request):
#         data = _flatten_data(request.data)
#         tran_id = data.get("tran_id")

#         pay = Payment.objects.filter(tran_id=tran_id).first()
#         if pay:
#             pay.gateway_response = data
#             pay.mark(PaymentStatus.FAIL_REDIRECT)
#             pay.save(update_fields=["gateway_response", "status"])

#         return Response({"detail": "fail received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

#     def post(self, request): return self._handle(request)
#     def get(self, request):  return self._handle(request)


# @method_decorator(csrf_exempt, name="dispatch")
# class SSLCancelView(APIView):
#     """
#     Browser will be redirected here by SSLCommerz when user cancels.
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def _handle(self, request):
#         data = _flatten_data(request.data)
#         tran_id = data.get("tran_id")

#         pay = Payment.objects.filter(tran_id=tran_id).first()
#         if pay:
#             pay.gateway_response = data
#             pay.mark(PaymentStatus.CANCEL_REDIRECT)
#             pay.save(update_fields=["gateway_response", "status"])

#         return Response({"detail": "cancel received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

#     def post(self, request): return self._handle(request)
#     def get(self, request):  return self._handle(request)


# @method_decorator(csrf_exempt, name="dispatch")
# class SSLIPNView(APIView):
#     """
#     Server-to-server IPN from SSLCommerz. This is the authoritative status.
#     We call the validator API using val_id and finalize the Payment status.
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def post(self, request):
#         data = _flatten_data(request.data)
#         tran_id = data.get("tran_id")
#         val_id = data.get("val_id")

#         if not (tran_id and val_id):
#             return Response({"detail": "tran_id and val_id required"}, status=400)

#         pay = Payment.objects.filter(tran_id=tran_id).first()
#         if not pay:
#             return Response({"detail": "payment not found"}, status=404)

#         try:
#             v = SSLCommerzClient().validate(val_id=val_id)
#         except Exception as e:
#             # If validator is temporarily unavailable, keep previous status but record the event
#             return Response({"detail": "validation error", "error": str(e)}, status=502)

#         pay.validation_response = v
#         status_flag = v.get("status")  # "VALID" / "VALIDATED" / "FAILED" / "EXPIRED" / etc.

#         if status_flag in {"VALID", "VALIDATED"}:
#             pay.mark(PaymentStatus.VALIDATED)
#         elif status_flag == "FAILED":
#             pay.mark(PaymentStatus.FAILED)
#         else:
#             # Could be EXPIRED / unknown; keep existing status but persist payload
#             pay.save(update_fields=["validation_response"])

#         pay.save(update_fields=["validation_response", "status"])
#         return Response({"detail": "ipn processed", "tran_id": tran_id, "status": pay.status}, status=200)


# @method_decorator(csrf_exempt, name="dispatch")
# class PaymentDetailByTranId(APIView):
#     """
#     Public read-only endpoint to check a payment by tran_id.
#     Useful for Postman/manual verification. Remove or restrict in production.
#     """
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     def get(self, request, tran_id: str):
#         pay = Payment.objects.filter(tran_id=tran_id).first()
#         if not pay:
#             return Response({"detail": "payment not found"}, status=404)
#         return Response(PaymentSerializer(pay).data, status=200)

from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

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
            app = get_object_or_404(AdmissionApplication.objects.select_for_update(), pk=application_id)
            batch = Batch.objects.select_for_update().get(pk=app.batch_id)

            # Expire overdue holds
            SeatHold.expire_overdue_now()
            active_holds = SeatHold.active_count_for_batch(batch.id)

            if batch.filled_seats + active_holds >= batch.total_seat:
                return Response({"detail": "Seats full for this batch."}, status=409)

            hold = SeatHold.objects.create(
                application=app,
                batch=batch,
                expires_at=timezone.now() + timezone.timedelta(minutes=HOLD_MINUTES),
                status=SeatHoldStatus.HELD,
            )

            # Create db payment row
            pay = Payment.objects.create(
                tran_id=None,                       # will be replaced after session
                amount=FIXED_ADMISSION_FEE,
                currency="BDT",
                created_by=None,
                application_id=application_id,
                status=PaymentStatus.REDIRECTED,
                create_payload={"hold_token": hold.hold_token, "application_id": application_id},
                gateway_response={},
            )

        # 2) Call SSL outside the DB lock
        client = SSLCommerzClient()
        customer = {
            "name":  f"{app.student_first_name_en} {app.student_last_name_en}".strip() if app.student_first_name_en else "Student",
            "email": app.student_email or "student@example.com",
            "phone": app.student_mobile or "01700000000",
            "address": "N/A",
            "city": "Dhaka",
            "postcode": "1200",
            "country": "Bangladesh",
        }
        try:
            tran_id, create_payload, gw_resp = client.start_payment(
                amount=FIXED_ADMISSION_FEE, currency="BDT", customer=customer, product_name=f"Admission Fee - App #{application_id}"
            )
        except Exception as e:
            # release the hold on any init error
            with transaction.atomic():
                h = SeatHold.objects.select_for_update().filter(hold_token=hold.hold_token, status=SeatHoldStatus.HELD).first()
                if h:
                    h.status = SeatHoldStatus.CANCELLED
                    h.save(update_fields=["status"])
            return Response({"detail": "SSLCommerz init error", "error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        # 3) Save session and return URL
        pay.tran_id = tran_id
        cp = (pay.create_payload or {})
        cp.update(create_payload or {})
        cp["hold_token"] = hold.hold_token
        cp["application_id"] = application_id
        pay.create_payload = cp
        pay.gateway_response = gw_resp
        pay.save(update_fields=["tran_id", "create_payload", "gateway_response"])

        if gw_resp.get("status") != "SUCCESS" or not gw_resp.get("GatewayPageURL"):
            with transaction.atomic():
                h = SeatHold.objects.select_for_update().filter(hold_token=hold.hold_token, status=SeatHoldStatus.HELD).first()
                if h:
                    h.status = SeatHoldStatus.CANCELLED
                    h.save(update_fields=["status"])
            pay.mark(PaymentStatus.FAILED)
            return Response({"detail": "SSLCommerz init failed", "gateway_response": gw_resp}, status=400)

        return Response(
            {"payment": PaymentSerializer(pay).data, "GatewayPageURL": gw_resp["GatewayPageURL"]},
            status=status.HTTP_201_CREATED,
        )


def _finalize_on_validation(pay: Payment, v: dict):
    """
    Strong validator checks. On VALID/VALIDATED:
      - mark payment VALIDATED (once) and emit payment_validated signal
    """
    status_flag = (v.get("status") or "").upper()
    same_tran  = (v.get("tran_id") == pay.tran_id)
    same_amt   = (Decimal(str(v.get("amount","0"))) == pay.amount == FIXED_ADMISSION_FEE)
    same_curr  = (v.get("currency") == "BDT")
    risk_ok    = str(v.get("risk_level", "0")) == "0"
    store_ok   = (v.get("store_id","").lower() == settings.SSLC_STORE_ID.lower())

    if status_flag in {"VALID","VALIDATED"} and all([same_tran, same_amt, same_curr, risk_ok, store_ok]):
        if pay.status != PaymentStatus.VALIDATED:
            pay.mark(PaymentStatus.VALIDATED)
            payment_validated.send(sender=Payment, payment=pay)
        return True
    return False


@method_decorator(csrf_exempt, name="dispatch")
class SSLSuccessView(APIView):
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

        pay.gateway_response = data
        if pay.status not in (PaymentStatus.VALIDATED,):
            pay.status = PaymentStatus.SUCCESS_REDIRECT
        pay.save(update_fields=["gateway_response", "status"])

        # Try immediate validation if val_id present
        if val_id:
            try:
                v = SSLCommerzClient().validate(val_id=val_id)
                pay.validation_response = v
                pay.save(update_fields=["validation_response"])
                _finalize_on_validation(pay, v)
            except Exception:
                pass

        return Response({"detail": "success received", "tran_id": tran_id, "val_id": val_id, "status": pay.status}, status=200)

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLFailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay and pay.status != PaymentStatus.VALIDATED:
            pay.gateway_response = data
            pay.mark(PaymentStatus.FAIL_REDIRECT)
            pay.save(update_fields=["gateway_response", "status"])
            _release_hold_from_pay(pay)
        return Response({"detail": "fail received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLCancelView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def _handle(self, request):
        data = _flatten_data(request.data)
        tran_id = data.get("tran_id")
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if pay and pay.status != PaymentStatus.VALIDATED:
            pay.gateway_response = data
            pay.mark(PaymentStatus.CANCEL_REDIRECT)
            pay.save(update_fields=["gateway_response", "status"])
            _release_hold_from_pay(pay)
        return Response({"detail": "cancel received", "tran_id": tran_id, "status": getattr(pay, "status", None)}, status=200)

    def post(self, request): return self._handle(request)
    def get(self, request):  return self._handle(request)


@method_decorator(csrf_exempt, name="dispatch")
class SSLIPNView(APIView):
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
            return Response({"detail": "validation error", "error": str(e)}, status=502)

        pay.validation_response = v
        ok = _finalize_on_validation(pay, v)
        pay.save(update_fields=["validation_response", "status"])
        return Response({"detail": "ipn processed", "tran_id": tran_id, "status": pay.status}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class PaymentDetailByTranId(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, tran_id: str):
        pay = Payment.objects.filter(tran_id=tran_id).first()
        if not pay:
            return Response({"detail": "payment not found"}, status=404)
        return Response(PaymentSerializer(pay).data, status=200)


# ---------- helpers ----------

def _release_hold_from_pay(pay: Payment):
    token = None
    cp = pay.create_payload or {}
    if isinstance(cp, dict):
        token = cp.get("hold_token")
    if not token:
        return
    with transaction.atomic():
        h = SeatHold.objects.select_for_update().filter(hold_token=token, status=SeatHoldStatus.HELD).first()
        if h:
            h.status = SeatHoldStatus.CANCELLED
            h.save(update_fields=["status"])
