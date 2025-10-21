from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Course, Batch
from .serializers import CourseSerializer, BatchSerializer

class IsAdminOrStaffForWrite(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        u = request.user
        return bool(u and u.is_authenticated and (u.is_staff or u.is_superuser))

# ------- Courses (CRUD via APIView) -------
class CourseListCreate(APIView):
    permission_classes = [IsAdminOrStaffForWrite]
    def get(self, request):
        q = Course.objects.all().order_by("grade_level","title")
        return Response(CourseSerializer(q, many=True).data)
    def post(self, request):
        s = CourseSerializer(data=request.data)
        if s.is_valid(): s.save(); return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseDetail(APIView):
    permission_classes = [IsAdminOrStaffForWrite]
    def get(self, request, pk):
        obj = get_object_or_404(Course, pk=pk)
        return Response(CourseSerializer(obj).data)
    def patch(self, request, pk):
        obj = get_object_or_404(Course, pk=pk)
        s = CourseSerializer(obj, data=request.data, partial=True)
        if s.is_valid(): s.save(); return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        obj = get_object_or_404(Course, pk=pk); obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------- Batches (CRUD via APIView) -------
class BatchListCreate(APIView):
    permission_classes = [IsAdminOrStaffForWrite]
    def get(self, request):
        qs = Batch.objects.select_related("course").all()
        # filters for landing / admissions
        course = request.query_params.get("course")
        grade  = request.query_params.get("grade_level")
        cls    = request.query_params.get("class")
        group  = request.query_params.get("group")
        days   = request.query_params.get("days")
        if course: qs = qs.filter(course_id=course)
        if grade:  qs = qs.filter(course__grade_level__iexact=grade)
        if cls:    qs = qs.filter(class_name__iexact=cls)
        if group:  qs = qs.filter(group_name__iexact=group)
        if days:   qs = qs.filter(days__icontains=days)
        return Response(BatchSerializer(qs.order_by("course__grade_level","batch_number"), many=True).data)
    def post(self, request):
        s = BatchSerializer(data=request.data)
        if s.is_valid(): s.save(); return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

class BatchDetail(APIView):
    permission_classes = [IsAdminOrStaffForWrite]
    def get(self, request, pk):
        obj = get_object_or_404(Batch, pk=pk)
        return Response(BatchSerializer(obj).data)
    def patch(self, request, pk):
        obj = get_object_or_404(Batch, pk=pk)
        s = BatchSerializer(obj, data=request.data, partial=True)
        if s.is_valid(): s.save(); return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        obj = get_object_or_404(Batch, pk=pk); obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------- Public (read-only) -------
class PublicCourses(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        q = Course.objects.filter(is_active=True).order_by("grade_level","title")
        return Response(CourseSerializer(q, many=True).data)

class PublicBatches(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        qs = Batch.objects.select_related("course").filter(is_active=True)
        grade = request.query_params.get("grade_level")
        if grade: qs = qs.filter(course__grade_level__iexact=grade)
        return Response(BatchSerializer(qs.order_by("course__grade_level","batch_number"), many=True).data)
