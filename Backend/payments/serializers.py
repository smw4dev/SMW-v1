# Backend/payments/serializers.py
from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id", "tran_id", "amount", "currency", "status",
            "application_id", "gateway", "created_at", "updated_at",
            "gateway_response", "validation_response",
        ]
        read_only_fields = ["id", "status", "gateway_response", "validation_response"]
