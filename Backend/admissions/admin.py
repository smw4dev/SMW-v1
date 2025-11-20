# Backend/admissions/admin.py

from django.contrib import admin
from .models import AdmissionApplication, Guardian


class GuardianInline(admin.TabularInline):
    model = Guardian
    extra = 0


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    # Keep it minimal and only use fields we are 100% sure exist.
    list_display = ("id",)

    # No list_filter / search_fields / autocomplete_fields / readonly_fields
    # tied to old fields like school, is_submitted, is_paid, etc.
    inlines = [GuardianInline]
