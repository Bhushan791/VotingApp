from rest_framework import serializers
from .models import Poll, PollOption, Vote


class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = ['id', 'option_text']


class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=False, required=False)
    user_voted = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    
    class Meta:
        model = Poll
        fields = ['id', 'title', 'description', 'category', 'created_by', 
                  'created_at', 'active', 'winner', 'options', 'user_voted', 'total_votes']  
        read_only_fields = ['created_by']
    
    def get_user_voted(self, obj):
        """Check if the current user has voted on this poll"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Vote.objects.filter(poll=obj, voted_by=request.user).exists()
        return False
    
    def get_total_votes(self, obj):
        """Get total number of votes for this poll"""
        return obj.votes.count()
    
    def create(self, validated_data):
        # Extract options data before creating poll
        options_data = validated_data.pop('options', [])
        
        # Create the poll
        poll = Poll.objects.create(**validated_data)
        
        # Create each option for this poll
        for option_data in options_data:
            PollOption.objects.create(poll=poll, **option_data)
        
        return poll
    
    def update(self, instance, validated_data):
        # Extract options data
        options_data = validated_data.pop('options', None)
        
        # Update poll fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update options if provided
        if options_data is not None:
            # Clear existing options and create new ones
            instance.options.all().delete()
            for option_data in options_data:
                PollOption.objects.create(poll=instance, **option_data)
        
        return instance


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'poll', 'option', 'voted_by', 'voted_at']
        read_only_fields = ['voted_by', 'voted_at']