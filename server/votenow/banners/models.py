from django.db import models

from polls.models import Poll
# Create your models here.
class Banner(models.Model):
    poll = models.OneToOneField(Poll, on_delete=models.CASCADE, related_name="banner")
    title = models.CharField(max_length=255) 
    image = models.ImageField(upload_to="banners")
    created_at = models.DateTimeField(auto_now_add=True) 




    def __str__(self):
        return f"Banner for {self.poll.title}"

    