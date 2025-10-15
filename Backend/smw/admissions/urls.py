from django.urls import path
from .views import SchoolListCreate, AdmissionApply, AdmissionList, AdmissionDetail, AdmissionReviewApprove

urlpatterns = [
    path("schools/", SchoolListCreate.as_view()),
    path("admissions/apply/", AdmissionApply.as_view()),
    path("admissions/", AdmissionList.as_view()),
    path("admissions/<int:pk>/", AdmissionDetail.as_view()),
    path("admissions/<int:pk>/review/", AdmissionReviewApprove.as_view()),
]
