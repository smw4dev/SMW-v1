from decimal import Decimal
from django.db import transaction
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings

from courses_app.models import Batch
from admissions.models import AdmissionApplication, SeatHold, SeatHoldStatus
from payments.signals import payment_validated  # we’ll add this in payments

FEE = Decimal(str(getattr(settings, "ADMISSION_FEE_BDT", "4625.00")))

@receiver(payment_validated)
def on_payment_validated(sender, payment, **kwargs):
    """
    Idempotent finalization:
    - Confirm active hold if present (and not expired) OR
    - Best-effort allocate if capacity remains (after expiring old holds)
    - Mark application as paid
    - Increment batch.filled_seats once
    """
    app_id = getattr(payment, "application_id", None)
    hold_token = (payment.create_payload or {}).get("hold_token") if hasattr(payment, "create_payload") else None
    if not app_id:
        return

    with transaction.atomic():
        app = AdmissionApplication.objects.select_for_update().filter(pk=app_id).select_related("batch").first()
        if not app:
            return
        batch = Batch.objects.select_for_update().get(pk=app.batch_id)

        # Already paid? (idempotent)
        if app.is_paid:
            return

        # Sanity checks
        if payment.amount != FEE or (payment.currency or "") != "BDT":
            return

        # Prefer confirming the held seat bound to this payment
        confirmed = False
        if hold_token:
            h = SeatHold.objects.select_for_update().filter(hold_token=hold_token).first()
            if h and h.status == SeatHoldStatus.HELD and h.expires_at > timezone.now():
                h.status = SeatHoldStatus.CONFIRMED
                h.save(update_fields=["status"])
                confirmed = True

        if confirmed:
            batch.filled_seats += 1
            batch.save(update_fields=["filled_seats"])
        else:
            # No active hold; try allocate if capacity still available (after expiring stale holds)
            SeatHold.expire_overdue_now()
            active_holds = SeatHold.active_count_for_batch(batch.id)
            if batch.filled_seats + active_holds < batch.total_seat:
                batch.filled_seats += 1
                batch.save(update_fields=["filled_seats"])
            else:
                # Capacity exhausted → in real life: auto-refund / waitlist / alert
                return

        app.is_paid = True
        app.save(update_fields=["is_paid"])
