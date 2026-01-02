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
    technology_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )
    username = serializers.CharField(source='profile.user.username', read_only=True)
    profile_picture = serializers.ImageField(source='profile.profile_picture', read_only=True)

    class Meta:
        model = Project
        # 'profile' ми не включаємо в fields, бо всі проєкти
        # і так належатимуть одному профілю.
        # Ми будемо фільтрувати за профілем у View.
        fields = [
            'id', 'profile', 'username', 'profile_picture', 'title', 'description', 'image', 'github_link',
            'live_link', 'views', 'created_at', 'technologies', 'technology_ids'
        ]
        extra_kwargs = {
            'profile': {'read_only': True},
            'views': {'read_only': True}
        }

    def create(self, validated_data):
        technology_ids = validated_data.pop('technology_ids', [])
        project = Project.objects.create(**validated_data)
        if technology_ids:
            project.technologies.set(technology_ids)
        return project

    def update(self, instance, validated_data):
        technology_ids = validated_data.pop('technology_ids', None)
        
        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update technologies if provided
        if technology_ids is not None:
            instance.technologies.set(technology_ids)
        
        return instance


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'profile', 'company', 'role', 'start_date',
            'end_date', 'description'
        ]
        extra_kwargs = {
            'profile': {'read_only': True}
        }


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'profile', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date'
        ]
        extra_kwargs = {
            'profile': {'read_only': True}
        }


