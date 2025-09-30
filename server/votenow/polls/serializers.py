from rest_framework import serializers
from .models import Poll, PollOption,Vote


class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = [ 'id', 'option_text']


class PollSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Poll
        fields = ['id', 'title', 'description', 'category', 'created_by', 'created_at', 'active', 'winner', 'options']



class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields= ['id', 'poll', 'option', 'voted_by', 'voted_at']
        read_only_fields = [ 'voted_by', 'voted_at']

