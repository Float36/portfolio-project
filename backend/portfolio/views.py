from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
import requests
from urllib.parse import urlparse
from django.db.models import Q
from users.permissions import IsOwnerOrReadOnly

from .models import Technology, Project, Experience, Education
from .serializers import (
    TechnologySerializer, ProjectSerializer,
    ExperienceSerializer, EducationSerializer
)


class TechnologyViewSet(viewsets.ModelViewSet):
    """
    Full CRUD with search functionality
    """
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['views', 'created_at', 'title']
    ordering = ['-views', '-created_at']

    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filtering by username
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(profile__user__username=username)

        # Filtering by search query (title)
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)

        return queryset

    def perform_create(self, serializer):
        """
        Автоматично прив'язуємо профіль залогіненого користувача
        до нового проєкту.
        """
        serializer.save(profile=self.request.user.profile)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_views(self, request, pk=None):
        project = self.get_object()
        project.views += 1
        project.save()
        return Response({'views': project.views}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def sync_github(self, request):
        """
        Кастомний ендпоінт для синхронізації проєктів з GitHub.
        Він спрацює на POST /api/v1/projects/sync-github/
        """

        profile = request.user.profile

        github_url = profile.github_url
        if not github_url:
            return Response(
                {"error": "Будь ласка, додайте посилання на ваш GitHub до вашого профілю."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Парсимо URL, щоб отримати шлях
            path_parts = urlparse(github_url).path.split('/')
            # Очищуємо від можливих порожніх рядків
            username = [part for part in path_parts if part][-1]
        except Exception as e:
            return Response(
                {"error": f"Не вдалося розпарсити GitHub username з URL: {github_url}. Помилка: {e}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # запит до GitHub API
        api_url = f"https://api.github.com/users/{username}/repos"
        headers = {'Accept': 'application/vnd.github.v3+json'}

        try:
            api_response = requests.get(api_url, headers=headers)
            api_response.raise_for_status()
            repos = api_response.json()
        except requests.RequestException as e:
            return Response(
                {"error": f"Помилка при зверненні до GitHub API: {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        synced_count = 0
        created_count = 0

        for repo in repos:
            # Ми не хочемо імпортувати форки
            if repo['fork']:
                continue

            # Використовуємо update_or_create для уникнення дублікатів
            # Він знаходить проєкт за 'github_link' або створює новий
            project, created = Project.objects.update_or_create(
                github_link=repo['html_url'],
                defaults={
                    'profile': profile,
                    'title': repo['name'],
                    'description': repo['description'] or "",
                    'live_link': repo['homepage'] or "",
                    # 'technologies' доведеться додати вручну пізніше
                }
            )

            synced_count += 1
            if created:
                created_count += 1

        # Повертаємо успішну відповідь
        return Response(
            {
                "message": "Синхронізація пройшла успішно",
                "total_synced": synced_count,
                "newly_created": created_count,
            },
            status=status.HTTP_200_OK
        )



class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        """
        Автоматично прив'язуємо профіль залогіненого користувача
        до нового проєкту.
        """
        serializer.save(profile=self.request.user.profile)


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        """
        Автоматично прив'язуємо профіль залогіненого користувача
        до нового проєкту.
        """
        serializer.save(profile=self.request.user.profile)







