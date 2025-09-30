# dashboard/urls.py
from django.urls import path
from .views import AdminDashboardAPIView, PoolStatsAPIView

urlpatterns = [
    path('admin-summary/', AdminDashboardAPIView.as_view(), name='admin-dashboard'),
    path('polls/<int:poll_id>/stats/', PoolStatsAPIView.as_view(), name='pool-stats'),
]
