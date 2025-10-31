from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Technology, Project, Experience, Education
from .serializers import (
    TechnologySerializer, ProjectSerializer,
    ExperienceSerializer, EducationSerializer
)


class TechnologyViewSet(viewsets.ModelViewSet):
    """
    Full CRUD
    """
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [permissions.AllowAny]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.AllowAny]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [permissions.AllowAny]


