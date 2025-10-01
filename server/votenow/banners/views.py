from django.shortcuts import render
from rest_framework import generics, permissions, parsers
from .models import Banner
from .serializers import BannerSerializer
from users.permissions import IsAdmin 

class BannerCreateAPIView(generics.CreateAPIView): 
    queryset = Banner.objects.all() 
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]  # CRITICAL!
    
    def get_serializer_context(self):
        return {'request': self.request}

class BannerListAPIView(generics.ListAPIView):
    queryset = Banner.objects.all() 
    serializer_class = BannerSerializer 
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}