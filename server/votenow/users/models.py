from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser 

## email username fname l name password created at updated at is staff 

class User(AbstractUser):
    ROLE_CHOICES  =  ( 
        ('admin', 'Admin') , 
        ('user', 'User')
    )



    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user') 


    def __str__(self):
        return f"{self.username} ({self.role})"
    