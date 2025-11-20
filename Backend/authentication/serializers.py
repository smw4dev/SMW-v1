# Backend/authentication/serializers.py
# users/serializers.py
from rest_framework import serializers
from .models import User
from drf_extra_fields.fields import Base64ImageField

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # photo = serializers.ImageField(required=False)
    photo = Base64ImageField(required=False, allow_null=True)
    class Meta:
        model = User
        fields = ['f_name', 'l_name', 'email', 'password', 'phone', 'photo']

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            f_name=validated_data['f_name'],
            l_name=validated_data['l_name'],
            phone=validated_data.get('phone', None),
            photo=validated_data.get('photo'),
            is_staff=False,
            is_approved=False
        )


class AdminCreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    photo = Base64ImageField(required=False, allow_null=True)  # Ensure photo is defined

    class Meta:
        model = User
        fields = ['f_name', 'l_name', 'email', 'password', 'phone', 'is_staff', 'is_approved', 'photo']

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            f_name=validated_data.get('f_name', ''),
            l_name=validated_data.get('l_name', ''),
            phone=validated_data.get('phone', None),  # Handle missing phone
            photo=validated_data.get('photo', None),
            is_staff=validated_data.get('is_staff', False),
            is_approved=validated_data.get('is_approved', False),
        )

