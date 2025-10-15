from django.urls import path
from .views import AdmissionPaymentCreate, PaymentIPN, MyPayments

urlpatterns = [
    path("payments/admission/<int:application_id>/", AdmissionPaymentCreate.as_view()),
    path("payments/ipn/sslcommerz/", PaymentIPN.as_view()),
    path("payments/mine/", MyPayments.as_view()),
]
