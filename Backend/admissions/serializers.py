# Backend/admissions/serializers.py

from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from .models import AdmissionApplication, Guardian
from courses_app.models import Batch
from django.utils import timezone
from django.utils.dateparse import parse_datetime, parse_date



class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = [
            "id",
            "role",
            "name",
            "occupation",
            "contact_number",
            "email_address",
            "is_primary_contact",
        ]


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    """
    Internal / admin serializer that exposes the flat AdmissionApplication model
    plus the related Guardian rows. This is used for listing, detail, review, etc.
    """
    picture = serializers.ImageField(read_only=True)
    guardians = GuardianSerializer(many=True, read_only=True)
    batch_detail = serializers.SerializerMethodField()

    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "student_name",
            "student_nick_name",
            "home_district",
            "date_of_birth",
            "sex",
            "current_class",
            "group_name",
            "subject",
            "jsc_school_name",
            "jsc_result",
            "ssc_school_name",
            "ssc_result",
            "batch",
            "batch_detail",
            "student_mobile",
            "student_email",
            "home_location",
            "picture",
            "hear_about_us",
            "prev_student",
            "status",
            "is_reviewed",
            "user",
            "created_at",
            "updated_at",
            "guardians",
        ]
        read_only_fields = [
            "is_reviewed",
            "created_at",
            "updated_at",
            "status",
            "user",
        ]

    def get_batch_detail(self, obj):
        batch = getattr(obj, "batch", None)
        if batch is None:
            return None
        course = getattr(batch, "course", None)
        label_parts = []
        if course and course.grade_level:
            label_parts.append(course.grade_level)
        if batch.batch_number:
            label_parts.append(f"Batch {batch.batch_number}")
        label = " ".join(label_parts).strip()
        schedule = " · ".join(filter(None, [batch.days, batch.time_slot])).strip()
        if schedule:
            label = f"{label} – {schedule}" if label else schedule
        if batch.group_name:
            label = f"{label} ({batch.group_name})" if label else batch.group_name
        course_data = None
        if course:
            course_data = {
                "id": course.id,
                "title": course.title,
                "grade_level": course.grade_level,
            }
        return {
            "id": batch.id,
            "label": label or str(batch),
            "batch_number": batch.batch_number,
            "class_name": batch.class_name,
            "group_name": batch.group_name,
            "days": batch.days,
            "time_slot": batch.time_slot,
            "course": course_data,
        }

    def validate(self, attrs):
        guardians = self.initial_data.get("guardians", [])
        roles = [g.get("role") for g in guardians if g.get("role")]
        if roles.count("FATHER") > 1 or roles.count("MOTHER") > 1:
            raise serializers.ValidationError("Duplicate guardian role.")
        if "FATHER" not in roles or "MOTHER" not in roles:
            raise serializers.ValidationError("Both Father and Mother are required.")
        return attrs

    def create(self, validated_data):
        guardians_data = validated_data.pop("guardians", [])
        app = AdmissionApplication.objects.create(**validated_data)
        for g in guardians_data:
            Guardian.objects.create(application=app, **g)
        return app


class PublicAdmissionApplicationSerializer(serializers.Serializer):
    """
    Serializer that understands the public admission form JSON:

    {
      "personalInformation": {...},
      "parentsAndGuardian": {...},
      "education": {...},
      "academicPreferences": {...},
      "metadata": {...},
      "attachments": {...}
    }

    It converts that payload into an AdmissionApplication + Guardian rows.
    """

    personalInformation = serializers.DictField()
    parentsAndGuardian = serializers.DictField()
    education = serializers.DictField(required=False)
    academicPreferences = serializers.DictField()
    metadata = serializers.DictField(required=False)
    attachments = serializers.DictField(required=False)

    def validate(self, data):
        errors = {}

        pi = data.get("personalInformation") or {}
        pg = data.get("parentsAndGuardian") or {}
        acad = data.get("academicPreferences") or {}

        def add_error(section, field, msg):
            errors.setdefault(section, {})
            errors[section][field] = msg

        # Basic required fields from the JSON
        if not pi.get("fullName"):
            add_error("personalInformation", "fullName", "This field is required.")
        if not pi.get("dateOfBirth"):
            add_error("personalInformation", "dateOfBirth", "This field is required.")
        if not pi.get("gender"):
            add_error("personalInformation", "gender", "This field is required.")
        if not pi.get("phone"):
            add_error("personalInformation", "phone", "This field is required.")

        if not acad.get("classLevel"):
            add_error("academicPreferences", "classLevel", "This field is required.")

        # We need a Batch to create an AdmissionApplication
        batch_id = acad.get("batchId") or acad.get("batch_id")
        if not batch_id:
            add_error("academicPreferences", "batchId", "This field is required.")

        father = (pg.get("father") or {})
        mother = (pg.get("mother") or {})
        if not father.get("name"):
            add_error("parentsAndGuardian", "father.name", "This field is required.")
        if not mother.get("name"):
            add_error("parentsAndGuardian", "mother.name", "This field is required.")

        if errors:
            raise serializers.ValidationError(errors)
        return data

    def create(self, validated_data):
        pi = validated_data.get("personalInformation") or {}
        pg = validated_data.get("parentsAndGuardian") or {}
        edu = validated_data.get("education") or {}
        acad = validated_data.get("academicPreferences") or {}
        attachments = validated_data.get("attachments") or {}

        def normalize(value):
            if value is None:
                return None
            value = str(value).strip()
            return value or None

        # --- Names ---
        full_name = (pi.get("fullName") or "").strip()
        nickname = normalize(pi.get("nickname"))
        home_district = normalize(pi.get("homeDistrict"))
        if home_district and len(home_district) > 120:
            home_district = home_district[:120]

        # --- DOB ---
        dob_raw = pi.get("dateOfBirth")
        dob = None
        if dob_raw:
            dt = parse_datetime(dob_raw)
            if dt is not None:
                if timezone.is_naive(dt):
                    dt = timezone.make_aware(dt, timezone.get_default_timezone())
                dob = dt.date()
            else:
                dob = parse_date(dob_raw)
        if not dob:
            raise serializers.ValidationError(
                {"personalInformation": {"dateOfBirth": "Invalid or missing date"}}
            )

        # --- Gender → SEX_CHOICES (M/F/O) ---
        gender_map = {"male": "M", "female": "F", "other": "O"}
        sex = gender_map.get(str(pi.get("gender", "")).lower(), "O")

        # --- Current class & group / subject ---
        current_class = (acad.get("classLevel") or "").strip()
        group_raw = (acad.get("group") or "").strip()
        if group_raw.lower() in {"", "not-required", "not_required", "n/a"}:
            group_name = None
        else:
            group_name = group_raw
        subject = normalize(acad.get("subject"))

        # --- JSC / SSC breakdown ---
        jsc = edu.get("jsc") or {}
        ssc = edu.get("ssc") or {}
        jsc_school_name = normalize(jsc.get("school"))
        jsc_result = normalize(jsc.get("grade"))
        ssc_school_name = normalize(ssc.get("school"))
        ssc_result = normalize(ssc.get("grade"))
        if jsc_school_name and len(jsc_school_name) > 255:
            jsc_school_name = jsc_school_name[:255]
        if ssc_school_name and len(ssc_school_name) > 255:
            ssc_school_name = ssc_school_name[:255]

        # --- Home address / district mapped to home_location ---
        address = (pi.get("address") or "").strip()
        home_location = address or None
        if home_district and home_district not in (address or ""):
            if home_location:
                home_location = f"{home_location} (District: {home_district})"
            else:
                home_location = home_district

        # --- Batch ---
        batch_id = acad.get("batchId") or acad.get("batch_id")
        try:
            batch = Batch.objects.get(pk=batch_id)
        except Batch.DoesNotExist:
            raise serializers.ValidationError(
                {"academicPreferences": {"batchId": "Invalid batch id"}}
            )

        # --- Hear about us / previous student ---
        raw_hear = normalize(acad.get("hearAboutUs"))
        hear_map = {
            "social-media": "social-media",
            "friend-family": "friend-family",
            "prev-student": "prev-student",
            "banner": "banner",
            "other": "other",
            # legacy labels
            "friends": "friend-family",
            "student": "prev-student",
            "newspaper": "banner",
            "website": "other",
        }
        hear_about_us = hear_map.get(raw_hear) if raw_hear else None
        prev_student = bool(acad.get("prevStudent"))

        # --- Contact & photo ---
        phone = normalize(pi.get("phone"))
        email = normalize(pi.get("email"))
        picture_file = None
        picture_raw = attachments.get("photoPreview")
        if picture_raw:
            # Expect a data URL or raw base64 string from the frontend.
            import base64
            import uuid
            from django.core.files.base import ContentFile

            data_str = str(picture_raw).strip()
            try:
                if ";base64," in data_str:
                    header, b64data = data_str.split(";base64,", 1)
                    if "image/" in header:
                        ext = header.split("image/")[-1]
                    else:
                        ext = "jpg"
                else:
                    b64data = data_str
                    ext = "jpg"
                decoded = base64.b64decode(b64data)
                filename = f"admission_{uuid.uuid4().hex[:12]}.{ext}"
                picture_file = ContentFile(decoded, name=filename)
            except Exception:
                picture_file = None

        # --- Create the AdmissionApplication with the new schema ---
        app = AdmissionApplication.objects.create(
            student_name=(full_name or "")[:120],
            student_nick_name=nickname,
            home_district=home_district,
            date_of_birth=dob,
            sex=sex,
            current_class=current_class,
            group_name=group_name,
            subject=subject,
            jsc_school_name=jsc_school_name,
            jsc_result=jsc_result,
            ssc_school_name=ssc_school_name,
            ssc_result=ssc_result,
            batch=batch,
            student_mobile=phone,
            student_email=email,
            home_location=home_location,
            picture=picture_file,
            hear_about_us=hear_about_us,
            prev_student=prev_student,
        )

        # --- Guardians (father & mother) ---
        father = pg.get("father") or {}
        mother = pg.get("mother") or {}
        guardian_meta = pg.get("guardian") or {}
        primary_relation = str(guardian_meta.get("relation") or "").lower()

        if father.get("name"):
            Guardian.objects.create(
                application=app,
                role="father",
                name=father.get("name"),
                occupation=father.get("occupation") or "",
                contact_number=father.get("phone") or "",
                is_primary_contact=primary_relation == "father",
            )

        if mother.get("name"):
            Guardian.objects.create(
                application=app,
                role="mother",
                name=mother.get("name"),
                occupation=mother.get("occupation") or "",
                contact_number=mother.get("phone") or "",
                is_primary_contact=primary_relation == "mother",
            )

        # Optionally handle an extra "other" guardian coming from the
        # flattened 'guardians' array that the public admission form sends.
        # This keeps backward compatibility for existing payloads that only
        # include father/mother while allowing richer guardian data.
        extra_guardians = self.initial_data.get("guardians") or []
        if isinstance(extra_guardians, list):
            for g in extra_guardians:
                role = str((g or {}).get("role") or "").lower()
                if role != "other":
                    continue

                name = normalize((g or {}).get("name"))
                if not name:
                    # Skip rows without a usable name
                    continue

                occupation = normalize((g or {}).get("occupation")) or ""
                contact_number = normalize((g or {}).get("contact_number")) or ""
                email_address = normalize((g or {}).get("email_address"))
                is_primary = bool((g or {}).get("is_primary_contact"))

                Guardian.objects.create(
                    application=app,
                    role="other",
                    name=name,
                    occupation=occupation,
                    contact_number=contact_number,
                    email_address=email_address,
                    is_primary_contact=is_primary,
                )

        return app
