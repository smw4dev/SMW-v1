from rest_framework import serializers
from .models import AdmissionApplication, Guardian, School
from drf_extra_fields.fields import Base64ImageField

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ["id","name","code","address","contact_phone","created_at","updated_at"]

class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ["id","role","name_en","name_bn","occupation","contact_number","email_address"]

class AdmissionApplicationSerializer(serializers.ModelSerializer):
    picture = Base64ImageField(source="picture_path", required=False, allow_null=True)
    guardians = GuardianSerializer(many=True)
    school_code = serializers.CharField(source="school.code", read_only=True)

    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "student_first_name_en","student_last_name_en","student_nick_name_en",
            "student_first_name_bn","student_last_name_bn","student_nick_name_bn",
            "date_of_birth","sex","current_class","prev_result",
            "batch","student_mobile","student_email","home_location","picture",
            "is_submitted","is_reviewed","is_approved","created_user","school","school_code","created_at",
            "guardians",
        ]
        read_only_fields = ["is_submitted","is_reviewed","is_approved","created_user","created_at"]

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
        if pic: validated_data["picture_path"] = pic  # store as base64 string or external path
        app = AdmissionApplication.objects.create(**validated_data)
        for g in guardians_data: Guardian.objects.create(application=app, **g)
        return app
