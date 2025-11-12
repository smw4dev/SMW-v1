from django.dispatch import Signal
# Fired exactly once on transition to VALIDATED
payment_validated = Signal()  # args: payment
