from rest_framework import serializers
from .models import Technology, Project, Experience, Education


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    """
        Тут ми хочемо показувати не просто ID технологій,
        а повні об'єкти (завдяки 'TechnologySerializer(many=True)').
        """
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        # 'profile' ми не включаємо в fields, бо всі проєкти
        # і так належатимуть одному профілю.
        # Ми будемо фільтрувати за профілем у View.
        fields = [
            'id', 'title', 'description', 'image', 'github_link',
            'live_link', 'created_at', 'technologies'
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'role', 'start_date',
            'end_date', 'description'
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date'
        ]


