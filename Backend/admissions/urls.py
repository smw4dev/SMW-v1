# Backend/admissions/urls.py
from django.urls import path
from .views import AdmissionApply, AdmissionList, AdmissionDetail, AdmissionReviewApprove

urlpatterns = [

    path("admissions/apply/", AdmissionApply.as_view()),
    path("admissions/", AdmissionList.as_view()),
    path("admissions/<int:pk>/", AdmissionDetail.as_view()),
    path("admissions/<int:pk>/review/", AdmissionReviewApprove.as_view()),
]
