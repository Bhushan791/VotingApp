from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger schema configuration
schema_view = get_schema_view(
    openapi.Info(
        title="Voting System API",
        default_version='v1',
        description="API documentation for the Polling System project.\n\n"
                    "This includes endpoints for user registration/login, polls, votes, "
                    "banners, and admin dashboard analytics.",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@votenow.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin panel
    path("admin/", admin.site.urls),

    # App endpoints
    path("api/users/", include("users.urls")),
    path("api/polls/", include("polls.urls")),
    path("api/banners/", include("banners.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path('api/admin/', include('admin_management.urls')),

    # Swagger & Redoc documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]






if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)