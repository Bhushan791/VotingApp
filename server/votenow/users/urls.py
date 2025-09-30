from django.urls import path
from .views import LoginAPIView, RegistrationAPIView, UserProfileAPIView



urlpatterns= [

    path('register/', RegistrationAPIView.as_view(), name='register') , 
    path('login/', LoginAPIView.as_view() , name='login'),
    path('profile/', UserProfileAPIView.as_view(), name='profile')

]