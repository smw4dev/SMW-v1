# Backend/authentication/urls.py
from django.urls import path
from .views import EndUserRegisterView, StaffUserRegisterView, EndUserLoginView, LogoutView, AdminUserLoginView, PasswordResetRequestView, PasswordResetConfirmView, AdminCreateUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,     # login
    TokenRefreshView,        # refresh access token
    TokenVerifyView          # optional: verify token
)

urlpatterns = [
    path('register/', EndUserRegisterView.as_view(), name='end-user-register'),
    path('admin/register/', StaffUserRegisterView.as_view(), name='staff-user-register'),

    path('admin/create-admin/', AdminCreateUserView.as_view(), name='create-admin-user'),

    path('login/', EndUserLoginView.as_view(), name='end-user-login'),
    path('admin/login/', AdminUserLoginView.as_view(), name='staff-user-login'),

    path('logout/', LogoutView.as_view(), name='logout'),

    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
