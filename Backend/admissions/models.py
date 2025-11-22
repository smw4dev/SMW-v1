from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
import uuid

from courses_app.models import Batch


SEX_CHOICES = (
    ("M", "Male"),
    ("F", "Female"),
    ("O", "Other"),
)


class AdmissionStatus(models.TextChoices):
    PENDING = "PENDING", "Pending (awaiting payment)"
    PAID = "PAID", "Paid / Confirmed"
    CANCELLED = "CANCELLED", "Cancelled"


HEAR_ABOUT_US_CHOICES = (
    ("social-media", "Social media"),
    ("friend-family", "Friend / family"),
    ("prev-student", "Previous student"),
    ("banner", "Banner / poster"),
    ("other", "Other"),
)


class AdmissionApplication(models.Model):
    """
    One admission attempt for a student for a specific Batch.
    Created from the frontend JSON payload before redirecting to SSLCommerz.
    """

    # --- Personal information ---
    student_name = models.CharField(max_length=120)
    student_nick_name = models.CharField(max_length=120, blank=True, null=True)
    home_district = models.CharField(max_length=120, blank=True, null=True)

    date_of_birth = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)

    # 'classLevel' from frontend, e.g. 'class-10'
    current_class = models.CharField(max_length=50)
    # academicPreferences.group, e.g. 'science'
    group_name = models.CharField(max_length=50, blank=True, null=True)
    # academicPreferences.subject, e.g. 'mathematics'
    subject = models.CharField(max_length=100, blank=True, null=True)

    # --- Education ---
    jsc_school_name = models.CharField(max_length=255, blank=True, null=True)
    jsc_result = models.CharField(max_length=120, blank=True, null=True)

    ssc_school_name = models.CharField(max_length=255, blank=True, null=True)
    ssc_result = models.CharField(max_length=120, blank=True, null=True)

    # --- Batch selection ---
    batch = models.ForeignKey(
        Batch,
        on_delete=models.PROTECT,
        related_name="applications",
    )

    # --- Contact & address ---
    student_mobile = models.CharField(max_length=20, blank=True, null=True)
    student_email = models.EmailField(blank=True, null=True)
    home_location = models.TextField(blank=True, null=True)  # address from frontend
    picture = models.ImageField(upload_to="admissions/", blank=True, null=True)

    # --- Extra meta from admission form ---
    hear_about_us = models.CharField(
        max_length=32,
        choices=HEAR_ABOUT_US_CHOICES,
        blank=True,
        null=True,
    )
    prev_student = models.BooleanField(default=False)

    # --- Process state ---
    status = models.CharField(
        max_length=16,
        choices=AdmissionStatus.choices,
        default=AdmissionStatus.PENDING,
    )
    # Optional manual review flag (keep if you really need it)
    is_reviewed = models.BooleanField(default=False)

    # Link to the eventual auth user (can be null until payment success)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="admissions",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.student_name} → {self.batch}"


class GuardianRole(models.TextChoices):
    FATHER = "father", "Father"
    MOTHER = "mother", "Mother"
    OTHER = "other", "Other"


class Guardian(models.Model):
    """
    Parent / guardian information for an application.

    You will typically have:
      - role='father'
      - role='mother'
      - optionally another with role='other'
    And one of them flagged is_primary_contact based on frontend 'guardian.relation'.
    """

    application = models.ForeignKey(
        AdmissionApplication,
        on_delete=models.CASCADE,
        related_name="guardians",
    )
    role = models.CharField(max_length=10, choices=GuardianRole.choices)
    name = models.CharField(max_length=150)
    occupation = models.CharField(max_length=150, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email_address = models.EmailField(blank=True, null=True)
    is_primary_contact = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.application_id} - {self.get_role_display()} - {self.name}"


class SeatHoldStatus(models.TextChoices):
    HELD = "HELD", "Held"
    CONFIRMED = "CONFIRMED", "Confirmed"
    EXPIRED = "EXPIRED", "Expired"
    CANCELLED = "CANCELLED", "Cancelled"


class SeatHold(models.Model):
    """
    Temporary seat reservation for a specific Application + Batch.

    - Created when user selects a batch / proceeds to payment.
    - Expires automatically based on 'expires_at'.
    - Marked CONFIRMED when payment is validated.
    """

    application = models.ForeignKey(
        AdmissionApplication,
        on_delete=models.CASCADE,
        related_name="seat_holds",
    )
    batch = models.ForeignKey(
        Batch,
        on_delete=models.CASCADE,
        related_name="seat_holds",
    )
    hold_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField()
    status = models.CharField(
        max_length=12,
        choices=SeatHoldStatus.choices,
        default=SeatHoldStatus.HELD,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["batch", "status", "expires_at"]),
        ]
        constraints = [
            # At most one active HELD seat hold per application
            models.UniqueConstraint(
                fields=["application"],
                condition=Q(status=SeatHoldStatus.HELD),
                name="unique_active_hold_per_application",
            )
        ]

    def __str__(self) -> str:
        return f"{self.application_id} - {self.batch_id} - {self.status}"

    @staticmethod
    def expire_overdue_now():
        now = timezone.now()
        SeatHold.objects.filter(
            status=SeatHoldStatus.HELD,
            expires_at__lte=now,
        ).update(status=SeatHoldStatus.EXPIRED)

    @staticmethod
    def active_count_for_batch(batch_id: int) -> int:
        now = timezone.now()
        return SeatHold.objects.filter(
            batch_id=batch_id,
            status=SeatHoldStatus.HELD,
            expires_at__gt=now,
        ).count()
