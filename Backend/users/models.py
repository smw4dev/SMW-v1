from django.db import models
from django.conf import settings

from courses_app.models import Batch


class UserProfile(models.Model):
    """
    Student profile linked to the auth.User.
    This is what you create AFTER payment success.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        unique=True,
    )

    phone = models.CharField(max_length=32, blank=True)
    # You can either use this or rely on authentication.User.photo
    photo_url = models.CharField(max_length=255, blank=True)

    # Current academic info
    current_class = models.CharField(max_length=50, blank=True)
    group_name = models.CharField(max_length=50, blank=True)

    # Optional; can copy from Admission's school or leave blank
    school_name = models.CharField(max_length=255, blank=True)

    # Unique internal student ID (e.g. "SMW-10-0001")
    student_uid = models.CharField(max_length=64, unique=True, blank=True)

    current_batch = models.ForeignKey(
        Batch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="profiles",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.user.email} - {self.student_uid or 'NO-UID'}"
