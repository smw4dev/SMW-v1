from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=120)
    grade_level = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.grade_level} - {self.title}"

class Batch(models.Model):
    batch_number = models.CharField(max_length=50)
    days = models.CharField(max_length=80)
    time_slot = models.CharField(max_length=80)
    total_seat = models.PositiveIntegerField(default=40)
    class_name = models.CharField(max_length=50)
    group_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # NEW for robust booking
    filled_seats = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [("course", "batch_number")]

    def __str__(self):
        return f"{self.course.grade_level} {self.batch_number} ({self.days} {self.time_slot})"

    @property
    def available_seats(self) -> int:
        return max(self.total_seat - self.filled_seats, 0)
