from django.db import models


class Course(models.Model):
    """
    High-level offering, e.g. 'Class 10 - Mathematics'.
    """

    title = models.CharField(max_length=120)          # e.g. "Mathematics"
    grade_level = models.CharField(max_length=50)     # e.g. "Class 10"
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.grade_level} - {self.title}"


class Batch(models.Model):
    """
    Specific batch (time-schedule) under a Course.

    For example:
      - course: Class 10 - Mathematics
      - batch_number: "Batch 2"
      - days: "Sun, Tue, Thu"
      - time_slot: "10:00 AM"
    """

    course = models.ForeignKey(
        Course,
        on_delete=models.PROTECT,
        related_name="batches",
    )

    batch_number = models.CharField(max_length=50)
    days = models.CharField(max_length=80)
    time_slot = models.CharField(max_length=80)

    # As per your current plan: 25 seats each batch.
    total_seat = models.PositiveIntegerField(default=25)

    # For compatibility with your design / image
    class_name = models.CharField(max_length=50)              # e.g. "Class 10"
    group_name = models.CharField(max_length=50, blank=True)  # e.g. "Science"

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("course", "batch_number")]

    def __str__(self) -> str:
        return f"{self.course.grade_level} {self.batch_number} ({self.days} {self.time_slot})"

    # --- Dynamic availability, derived from admissions + seat holds ---

    @property
    def confirmed_seats(self) -> int:
        """
        Number of fully paid/confirmed admissions for this batch.
        """
        from admissions.models import AdmissionApplication, AdmissionStatus
        return AdmissionApplication.objects.filter(
            batch=self,
            status=AdmissionStatus.PAID,
        ).count()

    @property
    def active_holds(self) -> int:
        """
        Number of currently active (non-expired) held seats for this batch.
        """
        from admissions.models import SeatHold
        return SeatHold.active_count_for_batch(self.id)

    @property
    def available_seats(self) -> int:
        """
        Seats that are still available, considering both paid admissions and holds.
        """
        return max(self.total_seat - self.confirmed_seats - self.active_holds, 0)
