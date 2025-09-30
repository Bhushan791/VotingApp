from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Poll, PollOption, Vote
from .serializers import PollSerializer, PollOptionSerializer, VoteSerializer
from users.permissions import IsAdmin, IsUser



##admin user
class PollCreateAPIView(generics.CreateAPIView)  :
    queryset= Poll.objects.all()
    serializer_class= PollSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


#3list al active pools

class PollListAPIView(generics.ListAPIView) :
    queryset = Poll.objects.filter(active = True)
    serializer_class = PollSerializer
    permission_classes =[permissions.AllowAny] 


##poll details with Options
class PollDetailAPIView(generics.RetrieveAPIView):
    queryset = Poll.objects.all() 
    serializer_class = PollSerializer
    permission_classes = [permissions.AllowAny] 


#3user votes in Poll

class VoteCreateAPIView(generics.CreateAPIView) :


    queryset = Poll.objects.all() 
    serializer_class =VoteSerializer 
    permission_classes = [permissions.IsAuthenticated, IsUser]

    def perform_create(self, serializer):
        serializer.save(voted_by=self.request.user)




class PollResultAPIView(generics.RetrieveAPIView):
    queryset = Poll.objects.all() 
    serializer_class = PollSerializer
    permission_classes = [permissions.AllowAny ]


    def get(self, request, *args,**kwargs):
        poll = self.get_object() 
        data =  {
            "poll" :poll.title , 
            "options" : [{
                "option_text": option.option_text,
                "votes_count" :option.votes_count,

        } for option in poll.options.all()]
        }

        return Response(data)
    
