from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import ( # <-- Імпортуйте це
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('config.api_router')),

    # Endpoints for JWT
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
