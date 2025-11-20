# Backend/users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

User = get_user_model()

class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # adjust to your custom fields in authentication.User
        fields = ["id", "email", "f_name", "l_name", "is_active", "is_staff", "is_superuser"]

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserLiteSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id", "user",
            "phone", "photo_url",
            "current_class", "group_name",
            "student_uid",
            "school", "current_batch",
            "created_at", "updated_at",
        ]
        read_only_fields = ["student_uid", "created_at", "updated_at"]
