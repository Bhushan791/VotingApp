from rest_framework import serializers 


class OptionStatsSerializer(serializers.Serializer):
    option_id  = serializers.IntegerField()
    option_text = serializers.CharField() 
    votes_count = serializers.IntegerField() 


class PollStatsSerializer(serializers.Serializer) : 
    poll_id = serializers.IntegerField() 
    poll_title  = serializers.CharField() 
    total_votes = serializers.IntegerField() 
    options = OptionStatsSerializer(many = True) 
    votes_last_3_hours = serializers.ListField(child= serializers.IntegerField())
    predicted_winner = serializers.DictField(allow_null = True)


class DashboardSummarySerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_polls = serializers.IntegerField()
    active_polls = serializers.IntegerField()
    top_polls = serializers.ListField(child=serializers.DictField())
    votes_last_7_days = serializers.ListField(child=serializers.IntegerField())

