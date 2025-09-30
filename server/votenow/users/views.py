from django.shortcuts import render
from .serializers import LoginSerializer, UserSerializer, RegistrationSerializer
from .models import User 
from rest_framework.response import Response
from .permissions import IsAdmin, IsUser 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status 
from rest_framework_simplejwt.tokens import RefreshToken

class RegistrationAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request) :
        serializer = RegistrationSerializer(data= request.data)
        if serializer.is_valid() :
            user= serializer.save() 
            serialized_user = UserSerializer(user)  
            return Response(serialized_user.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 




class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request) :
        serializer = LoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user= serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh), 
            'access' : str(refresh.access_token) ,
            'user' :UserSerializer(user).data
        })

class UserProfileAPIView(APIView) :
    permission_classes=[IsAuthenticated]
    def get(self, request) :
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
 
    