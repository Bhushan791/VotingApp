

from django.contrib import admin
from django.urls import path,include
urlpatterns = [
    path("admin/", admin.site.urls),
     path('api/users/', include('users.urls')),
     path('api/polls/', include('polls.urls')),
     path('api/banners/', include('banners.urls')),
     path('api/dashbaord/', include('dashboard.urls')),
] 

