from django.urls import path
from .views import (
    ProfileView, UserListView, UserDetailView,
    UserEditAPIView, UserDeleteAPIView,
)

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("user/edit/<int:pk>/", UserEditAPIView.as_view(), name="user-edit"),
    path("user/delete/<int:pk>/", UserDeleteAPIView.as_view(), name="user-delete"),
]
