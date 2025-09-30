from django.urls import path 
from .views import PollCreateAPIView, PollListAPIView, PollDetailAPIView, VoteCreateAPIView, PollResultAPIView



urlpatterns= [

path('', PollListAPIView.as_view() , name='poll-list')  ,



path('create/' , PollCreateAPIView.as_view(),  name = 'poll-create') , 


path('<int:pk>/', PollDetailAPIView.as_view() ,name='poll-detail'),

path('<int:pk>/vote/', VoteCreateAPIView.as_view(), name='poll-vote' ) , 
path('<ind:pk>/results/', PollResultAPIView.as_view() , name='poll-results'),

]
