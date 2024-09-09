from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from .routers import profile_router, projects_router, project_change_request_router, profile_change_requests_router
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView, TokenObtainPairView


from crow.views import *

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('additional/', AdditionalTag.as_view(), name='additionals'),
    path('verification/<uuid:token>', EmailVerification.as_view(), name='email_verification'),
    path('reset_password/<str:token>', ResetPassword.as_view(), name='reset_password'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + projects_router.urls + project_change_request_router.urls + profile_router.urls + profile_change_requests_router.urls

