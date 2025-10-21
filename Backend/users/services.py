from django.db.models import Max
from .models import UserProfile

def generate_student_uid(admission_year: int, school_code: str, class_name: str, batch_number: str) -> str:
    """
    UID = YY-SCH-CLS-B<batch>-NNNN
    Sequence resets per (year, school, class, batch).
    """
    yy = str(admission_year)[-2:]
    prefix = f"{yy}-{school_code}-{class_name}-B{batch_number}-"
    current = UserProfile.objects.filter(student_uid__startswith=prefix).aggregate(m=Max("student_uid")).get("m")
    last = int(current.split("-")[-1]) if current else 0
    return prefix + f"{last + 1:04d}"
