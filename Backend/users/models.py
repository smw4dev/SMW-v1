from django.db import models
from django.conf import settings
from courses_app.models import Batch
from admissions.models import School

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile", unique=True)
    phone = models.CharField(max_length=32, blank=True)
    photo_url = models.CharField(max_length=255, blank=True)
    current_class = models.CharField(max_length=50, blank=True)
    group_name = models.CharField(max_length=50, blank=True)
    student_uid = models.CharField(max_length=64, unique=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="profiles")
    current_batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name="profiles")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.user.email} - {self.student_uid or 'NO-UID'}"
