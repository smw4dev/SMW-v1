# Backend/courses_app/admin.py
from django.contrib import admin
from .models import Course, Batch

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "grade_level", "is_active", "created_at")
    list_filter  = ("is_active", "grade_level")
    search_fields = ("title", "description")

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ("id", "course", "batch_number", "days", "time_slot",
                    "total_seat", "class_name", "group_name", "is_active")
    list_filter  = ("is_active", "course", "class_name", "group_name", "days")
    search_fields = ("batch_number", "class_name", "group_name")
    autocomplete_fields = ("course",)
