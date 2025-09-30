from django.shortcuts import render
from rest_framework import generics , permissions 
from .models import Banner
from .serializers import BannerSerializer
from users.permissions import IsAdmin 



##creating banners
class BannerCreateAPIView(generics.CreateAPIView) : 
    queryset = Banner.objects.all() 
    serializer_class = BannerSerializer

    permission_classes  = [permissions.IsAuthenticated, IsAdmin] 





# listing banners

class BannerListAPIView(generics.ListAPIView) :
    queryset = Banner.objects.all() 
    serializer_class = BannerSerializer 
    permission_classes = [permissions.AllowAny ]




