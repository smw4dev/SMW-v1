from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .models import UserProfile
from .serializers import UserProfileSerializer, UserLiteSerializer
from .permissions import IsAdminOrStaff

User = get_user_model()

# ---------- Self profile ----------
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        s = UserProfileSerializer(profile, data=request.data, partial=True)
        if s.is_valid():
            # student_uid stays read-only here
            s.save()
            return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------- Admin/staff: list users ----------
class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        # light list with optional search
        q = request.query_params.get("q")
        qs = User.objects.all().order_by("-id")
        if q:
            qs = qs.filter(email__icontains=q) | qs.filter(f_name__icontains=q) | qs.filter(l_name__icontains=q)
        data = UserLiteSerializer(qs, many=True).data
        return Response(data)

# ---------- Admin/staff: user detail ----------
class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaff]

    def get(self, request, pk):
        u = get_object_or_404(User, pk=pk)
        return Response(UserLiteSerializer(u).data)

# ---------- Admin/staff: edit user profile ----------
class UserEditAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaff]

    def patch(self, request, pk):
        u = get_object_or_404(User, pk=pk)
        profile, _ = UserProfile.objects.get_or_create(user=u)
        s = UserProfileSerializer(profile, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

# ---------- Admin/staff: delete user ----------
class UserDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaff]

    def delete(self, request, pk):
        u = get_object_or_404(User, pk=pk)
        # optional: protect superusers
        if u.is_superuser:
            return Response({"detail": "Cannot delete superuser."}, status=status.HTTP_403_FORBIDDEN)
        u.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
