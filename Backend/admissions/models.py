from django.db import models
from django.conf import settings
from courses_app.models import Batch
from django.utils import timezone
import uuid

SEX_CHOICES = (("M","Male"),("F","Female"),("O","Other"))

class School(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=16, unique=True)
    address = models.CharField(max_length=255, blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.name} ({self.code})"

class AdmissionApplication(models.Model):

    student_name = models.CharField(max_length=120)
    student_nick_name  = models.CharField(max_length=120, blank=True, null=True)
    
    date_of_birth = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    current_class = models.CharField(max_length=50)
    jsc_result = models.CharField(max_length=120, blank=True, null=True)
    ssc_result = models.CharField(max_length=120, blank=True, null=True)

    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, related_name="applications")

    student_mobile = models.CharField(max_length=20, blank=True, null=True)
    student_email  = models.EmailField(blank=True, null=True)
    home_location  = models.TextField(blank=True, null=True)
    picture_path   = models.CharField(max_length=255, blank=True, null=True)

    is_submitted = models.BooleanField(default=True)
    is_reviewed  = models.BooleanField(default=False)
    is_approved  = models.BooleanField(default=False)

    STATUS_CHOICES = (
    ('draft', 'Draft'),
    ('paid', 'Paid'),
    ('pending', 'Pending'),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    created_user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="admission_application"
    )
    school = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.student_first_name_en} {self.student_last_name_en} -> {self.batch}"

class Guardian(models.Model):
    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name="guardians")
    role = models.CharField(max_length=10)
    name_en = models.CharField(max_length=150)
    occupation = models.CharField(max_length=150, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email_address = models.EmailField(blank=True, null=True)
    def __str__(self): return f"{self.role} - {self.name_en}"

class SeatHoldStatus(models.TextChoices):
    HELD = "HELD", "Held"
    CONFIRMED = "CONFIRMED", "Confirmed"
    EXPIRED = "EXPIRED", "Expired"
    CANCELLED = "CANCELLED", "Cancelled"

class SeatHold(models.Model):
    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name="seat_holds")
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="seat_holds")
    hold_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField()
    status = models.CharField(max_length=12, choices=SeatHoldStatus.choices, default=SeatHoldStatus.HELD)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["batch", "status", "expires_at"]),
        ]

    @staticmethod
    def expire_overdue_now():
        now = timezone.now()
        SeatHold.objects.filter(status=SeatHoldStatus.HELD, expires_at__lte=now).update(status=SeatHoldStatus.EXPIRED)

    @staticmethod
    def active_count_for_batch(batch_id):
        now = timezone.now()
        return SeatHold.objects.filter(
            batch_id=batch_id, status=SeatHoldStatus.HELD, expires_at__gt=now
        ).count()
