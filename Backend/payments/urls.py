# Backend/payments/urls.py


from django.urls import path

from .views import (
    AdmissionPaymentCreate,
    SSLSuccessView,
    SSLFailView,
    SSLCancelView,
    SSLIPNView,
    PaymentDetailByTranId,
)

urlpatterns = [
    # Start a payment for an admission application
    path(
        "admission/<int:application_id>/",
        AdmissionPaymentCreate.as_view(),
        name="payment-admission-create",
    ),

    # Browser redirects from SSLCommerz
    path("ssl/success/", SSLSuccessView.as_view(), name="ssl-success"),
    path("ssl/fail/", SSLFailView.as_view(), name="ssl-fail"),
    path("ssl/cancel/", SSLCancelView.as_view(), name="ssl-cancel"),

    # Server-to-server IPN
    path("ipn/sslcommerz/", SSLIPNView.as_view(), name="ssl-ipn"),

    # Debug / Postman helper – look up a payment by tran_id
    path(
        "detail/<str:tran_id>/",
        PaymentDetailByTranId.as_view(),
        name="payment-detail",
    ),
]
