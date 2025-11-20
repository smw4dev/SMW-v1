# Backend/courses_app/urls.py
from django.urls import path
from .views import (
    CourseListCreate, CourseDetail,
    BatchListCreate, BatchDetail,
    PublicCourses, PublicBatches
)

urlpatterns = [
    path("courses/", CourseListCreate.as_view()),
    path("courses/<int:pk>/", CourseDetail.as_view()),
    path("batches/", BatchListCreate.as_view()),
    path("batches/<int:pk>/", BatchDetail.as_view()),
    path("public/courses/", PublicCourses.as_view()),
    path("public/batches/", PublicBatches.as_view()),
]
