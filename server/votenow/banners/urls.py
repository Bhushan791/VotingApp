from django.urls import path 
from .views import BannerCreateAPIView, BannerListAPIView 



urlpatterns =  [ 
     


     path('', BannerListAPIView.as_view() , name="banner-list")  , 
     path('create/' , BannerCreateAPIView.as_view() , name="banner-create") 

     

    
]