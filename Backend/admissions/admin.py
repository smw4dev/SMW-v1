# Backend/admissions/admin.py

from django.contrib import admin
from .models import AdmissionApplication, Guardian, School


class GuardianInline(admin.TabularInline):
    model = Guardian
    extra = 0


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student_first_name_en",
        "student_last_name_en",
        "current_class",
        "batch",
        "is_submitted",
        "is_reviewed",
        "is_approved",
        "is_paid",
        "created_at",
    )
    list_filter = (
        "is_submitted",
        "is_reviewed",
        "is_approved",
        "is_paid",
        "current_class",
        "batch",
    )
    search_fields = (
        "student_first_name_en",
        "student_last_name_en",
        "student_mobile",
        "student_email",
    )
    autocomplete_fields = ("batch", "school")
    readonly_fields = ("created_at",)
    inlines = [GuardianInline]


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "contact_phone", "created_at", "updated_at")
    search_fields = ("name", "code")
