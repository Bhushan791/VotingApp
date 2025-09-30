from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate 

class UserSerializer(serializers.ModelSerializer) : 
    class Meta:
        model = User
        fields = ['id', 'username' , 'email', 'role'] 



class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only= True) 
    class Meta:
        model = User 
        fields = ['username' , 'email', 'password' , 'role'] 


    def create( self, validated_data) :
        user = User.objects.create_user(
            username=validated_data['username'] , 
            email=validated_data['email'] , 
            password=validated_data['password'] , 
            role = validated_data.get('role', 'user')
        )

        return user


class LoginSerializer(serializers.Serializer) :
    username = serializers.CharField()
    password = serializers.CharField(write_only = True) 


    def validate(self, data):
        user= authenticate(username= data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Invalid Credentials')

