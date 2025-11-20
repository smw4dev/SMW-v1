import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class PaymentMethod(models.TextChoices):
    SSLCOMMERZ = "SSLC", "SSLCommerz"
    MANUAL = "MANL", "Manual"


class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED", "Initiated"
    REDIRECTED = "REDIRECTED", "Gateway redirected"
    SUCCESS_REDIRECT = "SUCCESS_REDIRECT", "Success (browser)"
    FAIL_REDIRECT = "FAIL_REDIRECT", "Fail (browser)"
    CANCEL_REDIRECT = "CANCEL_REDIRECT", "Cancel (browser)"
    VALIDATED = "VALIDATED", "Validated (via val_id/IPN)"
    FAILED = "FAILED", "Failed"
    CANCELLED = "CANCELLED", "Cancelled"
    EXPIRED = "EXPIRED", "Expired"


class Payment(models.Model):
    """
    Canonical payment record for SSLCommerz and (optionally) other methods.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Merchant transaction ID you send to SSLCommerz (must be unique)
    tran_id = models.CharField(max_length=64, unique=True, db_index=True)

    # Domain links
    application = models.ForeignKey(
        "admissions.AdmissionApplication",
        on_delete=models.PROTECT,
        related_name="payments",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payments",
    )

    purpose = models.CharField(max_length=32, default="ADMISSION_FEE")

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="BDT")

    gateway = models.CharField(max_length=32, default="SSLCOMMERZ")
    method = models.CharField(
        max_length=4,
        choices=PaymentMethod.choices,
        default=PaymentMethod.SSLCOMMERZ,
    )

    status = models.CharField(
        max_length=32,
        choices=PaymentStatus.choices,
        default=PaymentStatus.INITIATED,
    )

    # Gateway identifiers / security fields
    gateway_trx_id = models.CharField(
        max_length=128,
        blank=True,
        help_text="Transaction ID returned by SSLCommerz (if different from tran_id).",
    )
    ssl_val_id = models.CharField(max_length=64, blank=True)
    ssl_status = models.CharField(max_length=32, blank=True)
    ssl_risk_level = models.CharField(max_length=16, blank=True)
    ssl_risk_title = models.CharField(max_length=64, blank=True)

    # Raw payloads / responses for audit / debugging
    create_payload = models.JSONField(null=True, blank=True)
    gateway_response = models.JSONField(null=True, blank=True)
    validation_response = models.JSONField(null=True, blank=True)

    # Free-form extra metadata if needed
    meta = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.tran_id} - {self.amount} {self.currency} [{self.status}]"

    def mark(self, new_status: str, *, save: bool = True):
        self.status = new_status
        if save:
            self.save(update_fields=["status", "updated_at"])
