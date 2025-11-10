from django.urls import path
from .views import (
    AdmissionPaymentCreate, SSLSuccessView, SSLFailView, SSLCancelView, SSLIPNView, PaymentDetailByTranId
)

urlpatterns = [
    path("admission/<int:application_id>/", AdmissionPaymentCreate.as_view(), name="payment-admission-create"),
    path("ssl/success/", SSLSuccessView.as_view(), name="ssl-success"),
    path("ssl/fail/",    SSLFailView.as_view(),    name="ssl-fail"),
    path("ssl/cancel/",  SSLCancelView.as_view(),  name="ssl-cancel"),
    path("ipn/sslcommerz/", SSLIPNView.as_view(),  name="ssl-ipn"),

    path("detail/<str:tran_id>/", PaymentDetailByTranId.as_view(), name="payment-detail"),

]
