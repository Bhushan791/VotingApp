from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User')
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def save(self, *args, **kwargs):
        # If user is superuser, set role to admin automatically
        if self.is_superuser:
            self.role = "admin"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
