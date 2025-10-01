from rest_framework import serializers
from users.models import User
from polls.models import Poll, PollOption, Vote
from banners.models import Banner


# ==================== USER MANAGEMENT ====================
class AdminUserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users in admin panel"""
    total_votes = serializers.SerializerMethodField()
    polls_created = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined', 
                  'last_login', 'total_votes', 'polls_created']
    
    def get_total_votes(self, obj):
        return obj.votes.count()
    
    def get_polls_created(self, obj):
        return obj.created_polls.count()


class AdminUserDetailSerializer(serializers.ModelSerializer):
    """Detailed user info for editing"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'is_active', 'is_staff', 'date_joined', 'last_login']
        read_only_fields = ['date_joined', 'last_login']


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user details"""
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff']
    
    def validate_role(self, value):
        if value not in ['admin', 'user']:
            raise serializers.ValidationError("Role must be 'admin' or 'user'")
        return value


# ==================== POLL MANAGEMENT ====================
class AdminPollOptionSerializer(serializers.ModelSerializer):
    votes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PollOption
        fields = ['id', 'option_text', 'votes_count']
    
    def get_votes_count(self, obj):
        return obj.votes.count()


class AdminPollListSerializer(serializers.ModelSerializer):
    """List view for polls with basic stats"""
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    total_votes = serializers.SerializerMethodField()
    options_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Poll
        fields = ['id', 'title', 'category', 'active', 'created_by_username', 
                  'created_at', 'total_votes', 'options_count']
    
    def get_total_votes(self, obj):
        return obj.votes.count()
    
    def get_options_count(self, obj):
        return obj.options.count()


class AdminPollDetailSerializer(serializers.ModelSerializer):
    """Detailed poll info with options"""
    options = AdminPollOptionSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    total_votes = serializers.SerializerMethodField()
    winner_text = serializers.SerializerMethodField()
    
    class Meta:
        model = Poll
        fields = ['id', 'title', 'description', 'category', 'active', 
                  'created_by', 'created_by_username', 'created_at', 
                  'winner', 'winner_text', 'options', 'total_votes']
        read_only_fields = ['created_at']
    
    def get_total_votes(self, obj):
        return obj.votes.count()
    
    def get_winner_text(self, obj):
        return obj.winner.option_text if obj.winner else None


class AdminPollUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating poll"""
    options = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Poll
        fields = ['title', 'description', 'category', 'active', 'winner', 'options']
    
    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        
        # Update poll fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update options if provided
        if options_data is not None:
            # Delete existing options
            instance.options.all().delete()
            # Create new options
            for option_text in options_data:
                PollOption.objects.create(poll=instance, option_text=option_text)
        
        return instance


# ==================== BANNER MANAGEMENT ====================
class AdminBannerListSerializer(serializers.ModelSerializer):
    poll_title = serializers.CharField(source='poll.title', read_only=True)
    poll_active = serializers.BooleanField(source='poll.active', read_only=True)
    
    class Meta:
        model = Banner
        fields = ['id', 'title', 'poll', 'poll_title', 'poll_active', 
                  'image', 'created_at']


class AdminBannerDetailSerializer(serializers.ModelSerializer):
    poll_title = serializers.CharField(source='poll.title', read_only=True)
    
    class Meta:
        model = Banner
        fields = ['id', 'title', 'poll', 'poll_title', 'image', 'created_at']
        read_only_fields = ['created_at']


class AdminBannerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['title', 'poll', 'image']


# ==================== VOTE MANAGEMENT ====================
class AdminVoteSerializer(serializers.ModelSerializer):
    """Serializer for viewing all votes"""
    poll_title = serializers.CharField(source='poll.title', read_only=True)
    option_text = serializers.CharField(source='option.option_text', read_only=True)
    voter_username = serializers.CharField(source='voted_by.username', read_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'poll', 'poll_title', 'option', 'option_text', 
                  'voted_by', 'voter_username', 'voted_at']


# ==================== BULK OPERATIONS ====================
class BulkDeleteSerializer(serializers.Serializer):
    """Serializer for bulk delete operations"""
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )