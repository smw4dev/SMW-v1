from django.db import models
from django.conf import settings
from courses_app.models import Batch

SEX_CHOICES = (("M","Male"),("F","Female"),("O","Other"))

class School(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=16, unique=True)  # goes into student_uid
    address = models.CharField(max_length=255, blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.name} ({self.code})"

class AdmissionApplication(models.Model):
    # Student names EN/BN
    student_first_name_en = models.CharField(max_length=100)
    student_last_name_en  = models.CharField(max_length=100)
    student_nick_name_en  = models.CharField(max_length=100, blank=True, null=True)
    student_first_name_bn = models.CharField(max_length=100, blank=True, null=True)
    student_last_name_bn  = models.CharField(max_length=100, blank=True, null=True)
    student_nick_name_bn  = models.CharField(max_length=100, blank=True, null=True)

    date_of_birth = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    current_class = models.CharField(max_length=50)  # "Class 8/9/10"
    prev_result = models.CharField(max_length=120, blank=True, null=True)

    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, related_name="applications")

    student_mobile = models.CharField(max_length=20, blank=True, null=True)
    student_email  = models.EmailField(blank=True, null=True)
    home_location  = models.TextField(blank=True, null=True)
    picture_path   = models.CharField(max_length=255, blank=True, null=True)

    # workflow
    is_submitted = models.BooleanField(default=True)
    is_reviewed  = models.BooleanField(default=False)
    is_approved  = models.BooleanField(default=False)

    # links
    created_user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="admission_application"
    )
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name="applications")

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.student_first_name_en} {self.student_last_name_en} -> {self.batch}"

class Guardian(models.Model):
    application = models.ForeignKey(AdmissionApplication, on_delete=models.CASCADE, related_name="guardians")
    role = models.CharField(max_length=10)  # FATHER | MOTHER
    name_en = models.CharField(max_length=150)
    name_bn = models.CharField(max_length=150, blank=True, null=True)
    occupation = models.CharField(max_length=150, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    email_address = models.EmailField(blank=True, null=True)
    def __str__(self): return f"{self.role} - {self.name_en}"
