# Backend/payments/signals.py

from django.dispatch import Signal

# Fired exactly once on transition to VALIDATED
# Sender: Payment model; args: payment=<Payment instance>
payment_validated = Signal()
