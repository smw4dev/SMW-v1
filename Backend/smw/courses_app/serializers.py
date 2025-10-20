from rest_framework import serializers
from .models import Course, Batch

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id","title","description","grade_level","is_active","created_at","updated_at"]

class BatchSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    grade_level = serializers.CharField(source="course.grade_level", read_only=True)
    class Meta:
        model = Batch
        fields = ["id","course","course_title","grade_level","batch_number","days","time_slot",
                  "total_seat","class_name","group_name","is_active","created_at","updated_at"]
