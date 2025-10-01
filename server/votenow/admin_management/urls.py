from django.urls import path
from .views import (
    # User Management
    AdminUserListView,
    AdminUserDetailView,
    AdminUserBulkDeleteView,
    
    # Poll Management
    AdminPollListView,
    AdminPollDetailView,
    AdminPollBulkDeleteView,
    AdminPollToggleActiveView,
    
    # Banner Management
    AdminBannerListView,
    AdminBannerDetailView,
    AdminBannerBulkDeleteView,
    
    # Vote Management
    AdminVoteListView,
    AdminVoteDeleteView,
    
    # Statistics
    AdminStatsView,
)

urlpatterns = [
    # ==================== USERS ====================
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/bulk-delete/', AdminUserBulkDeleteView.as_view(), name='admin-user-bulk-delete'),
    
    # ==================== POLLS ====================
    path('polls/', AdminPollListView.as_view(), name='admin-poll-list'),
    path('polls/<int:poll_id>/', AdminPollDetailView.as_view(), name='admin-poll-detail'),
    path('polls/<int:poll_id>/toggle-active/', AdminPollToggleActiveView.as_view(), name='admin-poll-toggle'),
    path('polls/bulk-delete/', AdminPollBulkDeleteView.as_view(), name='admin-poll-bulk-delete'),
    
    # ==================== BANNERS ====================
    path('banners/', AdminBannerListView.as_view(), name='admin-banner-list'),
    path('banners/<int:banner_id>/', AdminBannerDetailView.as_view(), name='admin-banner-detail'),
    path('banners/bulk-delete/', AdminBannerBulkDeleteView.as_view(), name='admin-banner-bulk-delete'),
    
    # ==================== VOTES ====================
    path('votes/', AdminVoteListView.as_view(), name='admin-vote-list'),
    path('votes/<int:vote_id>/', AdminVoteDeleteView.as_view(), name='admin-vote-delete'),
    
    # ==================== STATISTICS ====================
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
]