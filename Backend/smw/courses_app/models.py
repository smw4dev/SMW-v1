from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    grade_level = models.CharField(max_length=32)  # e.g., "Class 8", "Class 9", "Class 10"
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self): return f"{self.grade_level} - {self.title}"

class Batch(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="batches")
    batch_number = models.CharField(max_length=50)     # "1", "2", "3", "4", "SPL"
    days = models.CharField(max_length=80)             # "Sun,Tue,Thu" / "Sat,Mon,Wed"
    time_slot = models.CharField(max_length=80)        # "07:00 AM", "12:30 PM", "05:00 PM"
    total_seat = models.PositiveIntegerField(default=40)
    class_name = models.CharField(max_length=50)       # "Class 8/9/10"
    group_name = models.CharField(max_length=50, blank=True)  # "Science/Commerce/Arts"
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("course", "batch_number")]

    def __str__(self):
        return f"{self.course.grade_level} {self.batch_number} ({self.days} {self.time_slot})"
