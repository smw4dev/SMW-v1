from django.urls import path
from .views import AdmissionPaymentCreate, PaymentIPN, MyPayments, SSLSuccess, SSLFail, SSLCancel

urlpatterns = [
    path("payments/admission/<int:application_id>/", AdmissionPaymentCreate.as_view()),
    path("payments/ipn/sslcommerz/", PaymentIPN.as_view()),  # IPN (server->server)
    path("payments/ssl/success/", SSLSuccess.as_view()),     # browser redirect
    path("payments/ssl/fail/", SSLFail.as_view()),
    path("payments/ssl/cancel/", SSLCancel.as_view()),
    path("payments/mine/", MyPayments.as_view()),
]