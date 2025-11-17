# Backend/admissions/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import transaction

from .models import AdmissionApplication, School
from .serializers import (
    AdmissionApplicationSerializer,
    SchoolSerializer,
    PublicAdmissionApplicationSerializer,
)
from users.models import UserProfile
from users.services import generate_student_uid

User = get_user_model()


class SchoolListCreate(APIView):
    # Admin/staff write, public read
    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        return Response(
            SchoolSerializer(School.objects.all().order_by("name"), many=True).data
        )

    def post(self, request):
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        s = SchoolSerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class AdmissionApply(APIView):
    """
    Public endpoint used by the admission form.

    Expects the nested JSON you shared (personalInformation, parentsAndGuardian, etc.)
    and internally creates:
      - AdmissionApplication
      - Guardian (FATHER & MOTHER)
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PublicAdmissionApplicationSerializer(data=request.data)
        if serializer.is_valid():
            app = serializer.save()
            # Respond with the flat serializer so the frontend gets the application id etc.
            return Response(
                AdmissionApplicationSerializer(app).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdmissionList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        u = request.user
        if u.is_superuser or u.is_staff:
            qs = AdmissionApplication.objects.all().order_by("-id")
        else:
            qs = AdmissionApplication.objects.filter(created_user=u)
        return Response(AdmissionApplicationSerializer(qs, many=True).data)


class AdmissionDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        app = get_object_or_404(AdmissionApplication, pk=pk)
        # restrict normal users to own record
        if not (
            request.user.is_superuser
            or request.user.is_staff
            or app.created_user == request.user
        ):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return Response(AdmissionApplicationSerializer(app).data)


class AdmissionReviewApprove(APIView):
    """
    Admin/staff can mark an application as reviewed/approved.
    On approval:
      - Ensure a User exists (create if missing)
      - Activate + approve the User
      - Ensure UserProfile + student_uid are set
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def patch(self, request, pk):
        if not (request.user.is_superuser or request.user.is_staff):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        app = get_object_or_404(AdmissionApplication, pk=pk)
        is_reviewed = request.data.get("is_reviewed")
        is_approved = request.data.get("is_approved")
        changed = False

        if is_reviewed is not None:
            app.is_reviewed = bool(is_reviewed)
            changed = True
        if is_approved is not None:
            app.is_approved = bool(is_approved)
            changed = True
        if changed:
            app.save()

        # On approve, ensure user + profile + student_uid
        if app.is_approved:
            user = app.created_user

            # If payment already created a user, reuse it; else create now
            if user is None:
                email = app.student_email or f"student_{app.id}@example.com"
                password = User.objects.make_random_password()
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    f_name=app.student_first_name_en,
                    l_name=app.student_last_name_en,
                )
                app.created_user = user
                app.save(update_fields=["created_user"])

            # Activate + mark approved at this stage
            update_fields = []
            if not user.is_active:
                user.is_active = True
                update_fields.append("is_active")
            if hasattr(user, "is_approved") and not user.is_approved:
                user.is_approved = True
                update_fields.append("is_approved")
            if update_fields:
                user.save(update_fields=update_fields)

            # User profile and UID
            from datetime import datetime  # noqa: F401 (kept for clarity)

            year = app.created_at.year
            school_code = app.school.code if app.school else "UNK"
            class_name = app.current_class
            batch_number = app.batch.batch_number
            uid = generate_student_uid(year, school_code, class_name, batch_number)

            prof, _ = UserProfile.objects.get_or_create(user=user)
            prof.current_class = class_name
            prof.group_name = app.batch.group_name or ""
            prof.school = app.school
            prof.current_batch = app.batch
            prof.student_uid = uid
            prof.save()

        return Response(
            AdmissionApplicationSerializer(app).data, status=status.HTTP_200_OK
        )
