import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone

class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED", "Initiated"
    REDIRECTED = "REDIRECTED", "Gateway Redirected"
    SUCCESS_REDIRECT = "SUCCESS_REDIRECT", "Success (browser)"
    FAIL_REDIRECT    = "FAIL_REDIRECT", "Fail (browser)"
    CANCEL_REDIRECT  = "CANCEL_REDIRECT", "Cancel (browser)"
    VALIDATED = "VALIDATED", "Validated"
    FAILED    = "FAILED", "Failed"
    CANCELLED = "CANCELLED", "Cancelled"
    EXPIRED   = "EXPIRED", "Expired"

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tran_id = models.CharField(max_length=64, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="BDT")

    gateway = models.CharField(max_length=32, default="SSLCOMMERZ")
    status = models.CharField(max_length=32, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED)

    # Who/what is this for (optional links to your domain entities)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    application_id = models.IntegerField(null=True, blank=True)  # link to your AdmissionApplication if you want

    # Raw payloads / responses for audit
    create_payload = models.JSONField(null=True, blank=True)
    gateway_response = models.JSONField(null=True, blank=True)
    validation_response = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def mark(self, new_status, *, save=True):
        self.status = new_status
        if save:
            self.save(update_fields=["status", "updated_at"])
