from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    """
    Серіалайзер для стандартної моделі User
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'lat_name']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Серіалайзер для нашого Профілю.
    Він також включає в себе дані з UserSerializer
    (через 'user = UserSerializer()')
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'profile_picture',
            'resume_cv', 'github_url', 'linkedin_url'
        ]