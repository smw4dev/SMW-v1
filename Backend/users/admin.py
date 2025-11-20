# Backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import UserProfile
from authentication.models import User  # your custom user


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "f_name", "l_name", "is_active", "is_staff", "is_superuser", "is_approved")
    list_filter = ("is_active", "is_staff", "is_superuser", "is_approved", "is_staff_request")
    search_fields = ("email", "f_name", "l_name", "phone")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("f_name", "l_name", "phone", "photo")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_approved",
                    "is_staff_request",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "created_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_approved",
                ),
            },
        ),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    # Minimal, only definitely-existing relations/fields
    list_display = ("id", "user")
    # Remove school/current_batch etc. until models are finalized
    # list_filter, search_fields, autocomplete_fields can be re-added later
