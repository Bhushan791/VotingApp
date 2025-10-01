from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from users.models import User
from polls.models import Poll, PollOption, Vote
from banners.models import Banner
from users.permissions import IsAdmin

from .serializers import (
    AdminUserListSerializer, AdminUserDetailSerializer, AdminUserUpdateSerializer,
    AdminPollListSerializer, AdminPollDetailSerializer, AdminPollUpdateSerializer,
    AdminBannerListSerializer, AdminBannerDetailSerializer, AdminBannerUpdateSerializer,
    AdminVoteSerializer, BulkDeleteSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ==================== USER MANAGEMENT ====================
class AdminUserListView(APIView):
    """List all users with search & filter"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        # Get query parameters
        search = request.query_params.get('search', '')
        role = request.query_params.get('role', '')
        is_active = request.query_params.get('is_active', '')
        
        # Base queryset
        users = User.objects.all().order_by('-date_joined')
        
        # Apply filters
        if search:
            users = users.filter(
                Q(username__icontains=search) | 
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        if role:
            users = users.filter(role=role)
        
        if is_active:
            users = users.filter(is_active=is_active.lower() == 'true')
        
        # Pagination
        paginator = self.pagination_class()
        paginated_users = paginator.paginate_queryset(users, request)
        
        serializer = AdminUserListSerializer(paginated_users, many=True)
        return paginator.get_paginated_response(serializer.data)


class AdminUserDetailView(APIView):
    """Get, Update, or Delete a specific user"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = AdminUserDetailSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            # Prevent editing own account via this endpoint
            if user.id == request.user.id:
                return Response(
                    {"error": "Cannot edit your own account through this endpoint"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(AdminUserDetailSerializer(user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            # Prevent deleting own account
            if user.id == request.user.id:
                return Response(
                    {"error": "Cannot delete your own account"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            username = user.username
            user.delete()
            return Response(
                {"message": f"User '{username}' deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminUserBulkDeleteView(APIView):
    """Bulk delete users"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        if serializer.is_valid():
            ids = serializer.validated_data['ids']
            
            # Prevent deleting own account
            if request.user.id in ids:
                return Response(
                    {"error": "Cannot delete your own account"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            deleted_count = User.objects.filter(id__in=ids).delete()[0]
            return Response({
                "message": f"{deleted_count} users deleted successfully"
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== POLL MANAGEMENT ====================
class AdminPollListView(APIView):
    """List all polls with search & filter"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        # Get query parameters
        search = request.query_params.get('search', '')
        category = request.query_params.get('category', '')
        active = request.query_params.get('active', '')
        
        # Base queryset
        polls = Poll.objects.all().order_by('-created_at')
        
        # Apply filters
        if search:
            polls = polls.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        if category:
            polls = polls.filter(category=category)
        
        if active:
            polls = polls.filter(active=active.lower() == 'true')
        
        # Pagination
        paginator = self.pagination_class()
        paginated_polls = paginator.paginate_queryset(polls, request)
        
        serializer = AdminPollListSerializer(paginated_polls, many=True)
        return paginator.get_paginated_response(serializer.data)


class AdminPollDetailView(APIView):
    """Get, Update, or Delete a specific poll"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request, poll_id):
        try:
            poll = Poll.objects.get(id=poll_id)
            serializer = AdminPollDetailSerializer(poll)
            return Response(serializer.data)
        except Poll.DoesNotExist:
            return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, poll_id):
        try:
            poll = Poll.objects.get(id=poll_id)
            serializer = AdminPollUpdateSerializer(poll, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(AdminPollDetailSerializer(poll).data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Poll.DoesNotExist:
            return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, poll_id):
        try:
            poll = Poll.objects.get(id=poll_id)
            title = poll.title
            poll.delete()
            return Response(
                {"message": f"Poll '{title}' deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Poll.DoesNotExist:
            return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminPollBulkDeleteView(APIView):
    """Bulk delete polls"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        if serializer.is_valid():
            ids = serializer.validated_data['ids']
            deleted_count = Poll.objects.filter(id__in=ids).delete()[0]
            return Response({
                "message": f"{deleted_count} polls deleted successfully"
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminPollToggleActiveView(APIView):
    """Toggle poll active status"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request, poll_id):
        try:
            poll = Poll.objects.get(id=poll_id)
            poll.active = not poll.active
            poll.save()
            
            return Response({
                "message": f"Poll is now {'active' if poll.active else 'inactive'}",
                "active": poll.active
            })
        except Poll.DoesNotExist:
            return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)


# ==================== BANNER MANAGEMENT ====================
class AdminBannerListView(APIView):
    """List all banners"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        search = request.query_params.get('search', '')
        
        banners = Banner.objects.all().order_by('-created_at')
        
        if search:
            banners = banners.filter(
                Q(title__icontains=search) | 
                Q(poll__title__icontains=search)
            )
        
        paginator = self.pagination_class()
        paginated_banners = paginator.paginate_queryset(banners, request)
        
        serializer = AdminBannerListSerializer(paginated_banners, many=True)
        return paginator.get_paginated_response(serializer.data)


class AdminBannerDetailView(APIView):
    """Get, Update, or Delete a specific banner"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request, banner_id):
        try:
            banner = Banner.objects.get(id=banner_id)
            serializer = AdminBannerDetailSerializer(banner)
            return Response(serializer.data)
        except Banner.DoesNotExist:
            return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, banner_id):
        try:
            banner = Banner.objects.get(id=banner_id)
            serializer = AdminBannerUpdateSerializer(banner, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(AdminBannerDetailSerializer(banner).data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Banner.DoesNotExist:
            return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, banner_id):
        try:
            banner = Banner.objects.get(id=banner_id)
            title = banner.title
            banner.delete()
            return Response(
                {"message": f"Banner '{title}' deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Banner.DoesNotExist:
            return Response({"error": "Banner not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminBannerBulkDeleteView(APIView):
    """Bulk delete banners"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        serializer = BulkDeleteSerializer(data=request.data)
        if serializer.is_valid():
            ids = serializer.validated_data['ids']
            deleted_count = Banner.objects.filter(id__in=ids).delete()[0]
            return Response({
                "message": f"{deleted_count} banners deleted successfully"
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== VOTE MANAGEMENT ====================
class AdminVoteListView(APIView):
    """List all votes with filters"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        poll_id = request.query_params.get('poll_id', '')
        user_id = request.query_params.get('user_id', '')
        
        votes = Vote.objects.all().select_related('poll', 'option', 'voted_by').order_by('-voted_at')
        
        if poll_id:
            votes = votes.filter(poll_id=poll_id)
        
        if user_id:
            votes = votes.filter(voted_by_id=user_id)
        
        paginator = self.pagination_class()
        paginated_votes = paginator.paginate_queryset(votes, request)
        
        serializer = AdminVoteSerializer(paginated_votes, many=True)
        return paginator.get_paginated_response(serializer.data)


class AdminVoteDeleteView(APIView):
    """Delete a specific vote (for moderation)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def delete(self, request, vote_id):
        try:
            vote = Vote.objects.get(id=vote_id)
            vote_info = f"{vote.voted_by.username}'s vote on {vote.poll.title}"
            vote.delete()
            return Response(
                {"message": f"Deleted: {vote_info}"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Vote.DoesNotExist:
            return Response({"error": "Vote not found"}, status=status.HTTP_404_NOT_FOUND)


# ==================== STATISTICS ====================
class AdminStatsView(APIView):
    """Quick stats for admin overview"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        stats = {
            "total_users": User.objects.count(),
            "admin_users": User.objects.filter(role='admin').count(),
            "regular_users": User.objects.filter(role='user').count(),
            "total_polls": Poll.objects.count(),
            "active_polls": Poll.objects.filter(active=True).count(),
            "inactive_polls": Poll.objects.filter(active=False).count(),
            "total_votes": Vote.objects.count(),
            "total_banners": Banner.objects.count(),
        }
        return Response(stats)