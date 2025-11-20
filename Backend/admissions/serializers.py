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
        fields = ["id", "role", "name_en", "name_bn", "occupation", "contact_number", "email_address"]


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    """
    Internal / admin serializer that exposes the flat AdmissionApplication model
    plus the related Guardian rows. This is used for listing, detail, review, etc.
    """
    picture = Base64ImageField(source="picture_path", required=False, allow_null=True)
    guardians = GuardianSerializer(many=True)
    school_code = serializers.CharField(source="school.code", read_only=True)

    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "student_first_name_en", "student_last_name_en", "student_nick_name_en",
            "student_first_name_bn", "student_last_name_bn", "student_nick_name_bn",
            "date_of_birth", "sex", "current_class", "prev_result",
            "batch", "student_mobile", "student_email", "home_location", "picture",
            "is_submitted", "is_reviewed", "is_approved", "is_paid",
            "created_user", "school", "school_code", "created_at",
            "guardians",
        ]
        read_only_fields = [
            "is_submitted",
            "is_reviewed",
            "is_approved",
            "is_paid",
            "created_user",
            "created_at",
        ]

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
        pic = self.initial_data.get("picture")
        if pic:
            validated_data["picture_path"] = pic  # store as base64 string or external path
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
        from .models import AdmissionApplication, Guardian

        pi = validated_data.get("personalInformation") or {}
        pg = validated_data.get("parentsAndGuardian") or {}
        edu = validated_data.get("education") or {}
        acad = validated_data.get("academicPreferences") or {}
        attachments = validated_data.get("attachments") or {}

        # --- Names ---
        full_name = (pi.get("fullName") or "").strip()
        parts = full_name.split()
        first_name = parts[0] if parts else ""
        last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

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

        # --- Gender → SEX_CHOICES ---
        gender_map = {"male": "M", "female": "F", "other": "O"}
        sex = gender_map.get(str(pi.get("gender", "")).lower(), "O")

        # --- Current class ---
        current_class = (acad.get("classLevel") or "").strip()

        # --- Previous result summary from JSC/SSC ---
        prev_result_parts = []
        jsc = edu.get("jsc") or {}
        ssc = edu.get("ssc") or {}
        if jsc.get("school") or jsc.get("grade"):
            prev_result_parts.append(
                f"JSC: {jsc.get('school', '')} (GPA {jsc.get('grade', '')})"
            )
        if ssc.get("school") or ssc.get("grade"):
            prev_result_parts.append(
                f"SSC: {ssc.get('school', '')} (GPA {ssc.get('grade', '')})"
            )
        prev_result = " | ".join(prev_result_parts) if prev_result_parts else None

        # --- Home address / district mapped to home_location ---
        address = (pi.get("address") or "").strip()
        home_district = (pi.get("homeDistrict") or "").strip()
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

        # --- Photo (data URL / base64) ---
        picture = attachments.get("photoPreview")

        # --- Create the AdmissionApplication ---
        app = AdmissionApplication.objects.create(
            student_first_name_en=first_name,
            student_last_name_en=last_name or first_name,
            student_nick_name_en=pi.get("nickname") or None,
            date_of_birth=dob,
            sex=sex,
            current_class=current_class,
            prev_result=prev_result,
            batch=batch,
            student_mobile=pi.get("phone") or None,
            student_email=pi.get("email") or None,
            home_location=home_location,
            picture_path=picture or None,
            is_submitted=True,
        )

        # --- Guardians (father & mother) ---
        father = pg.get("father") or {}
        mother = pg.get("mother") or {}

        if father.get("name"):
            Guardian.objects.create(
                application=app,
                role="FATHER",
                name_en=father.get("name"),
                occupation=father.get("occupation") or "",
                contact_number=father.get("phone") or "",
            )

        if mother.get("name"):
            Guardian.objects.create(
                application=app,
                role="MOTHER",
                name_en=mother.get("name"),
                occupation=mother.get("occupation") or "",
                contact_number=mother.get("phone") or "",
            )

        # Note: parentsAndGuardian.guardian (relation/contact) can be used later
        # if you want to store "primary guardian" separately.

        return app
