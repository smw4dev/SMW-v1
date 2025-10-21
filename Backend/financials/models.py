from django.db import models
from django.conf import settings
from admissions.models import AdmissionApplication

class PaymentMethod(models.TextChoices):
    SSLCOMMERZ = "SSLC", "SSLCommerz"
    MANUAL = "MANL", "Manual"

class PaymentStatus(models.TextChoices):
    INITIATED = "INIT", "Initiated"
    SUCCESS = "SUCC", "Success"
    FAILED = "FAIL", "Failed"

class Payment(models.Model):
    purpose = models.CharField(max_length=32, default="ADMISSION_FEE")  # extensible
    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name="payments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    method = models.CharField(max_length=4, choices=PaymentMethod.choices, default=PaymentMethod.SSLCOMMERZ)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="BDT")
    status = models.CharField(max_length=4, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED)
    gateway_trx_id = models.CharField(max_length=128, blank=True)  # from SSLCommerz
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
