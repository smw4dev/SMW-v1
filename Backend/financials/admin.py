from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "purpose", "application", "user",
                    "method", "amount", "currency", "status", "created_at")
    list_filter  = ("status", "method", "currency", "purpose")
    search_fields = ("gateway_trx_id", "user__email", "application__student_email")
    autocomplete_fields = ("application", "user")
    readonly_fields = ("created_at", "updated_at")
