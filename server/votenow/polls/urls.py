from django.urls import path 
from .views import PollCreateAPIView, PollListAPIView, PollDetailAPIView, VoteCreateAPIView, PollResultAPIView,PollOptionBulkCreateAPIView,AdminAllPollsAPIView


urlpatterns= [

path('', PollListAPIView.as_view() , name='poll-list')  ,

path('create/' , PollCreateAPIView.as_view(),  name = 'poll-create') , 

path('<int:pk>/', PollDetailAPIView.as_view() ,name='poll-detail'),

path('<int:pk>/vote/', VoteCreateAPIView.as_view(), name='poll-vote' ) , 
path('<int:pk>/results/', PollResultAPIView.as_view() , name='poll-results'),
path('<int:poll_id>/options/create/', PollOptionBulkCreateAPIView.as_view(), name='poll-option-create'),
path('admin/all/', AdminAllPollsAPIView.as_view(), name='admin-all-polls'),

]


