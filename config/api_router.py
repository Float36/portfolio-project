from rest_framework.routers import DefaultRouter

from users.views import UserProfileViewSet
from portfolio.views import (
    TechnologyViewSet,
    ProjectViewSet,
    ExperienceViewSet,
    EducationViewSet
)

router = DefaultRouter()

# users
router.register(r'profiles', UserProfileViewSet, basename='userprofile')

# portfolio
router.register(r'technologies', TechnologyViewSet, basename='technology')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'education', EducationViewSet, basename='education')


urlpatterns = router.urls


