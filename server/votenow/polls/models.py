from django.db import models

# Create your models here.
from users.models import User 

class Poll(models.Model) :
    title  = models.CharField(max_length=255)
    description = models.TextField() 
    category = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_polls")
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    winner = models.ForeignKey('PollOption', null =True, on_delete=models.SET_NULL, related_name='winner_poll')



    def __str__(self):
        return self.title




class PollOption(models.Model) : 
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="options")
    option_text = models.CharField(max_length=255)


    def __str__(self):
        return f"{self.option_text} ({self.poll.title})"
    

class Vote(models.Model) :
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE , related_name='votes')
    option =models.ForeignKey(PollOption, on_delete=models.CASCADE, related_name='votes')


    voted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll', 'voted_by')


    def __str__(self):
        return f"{self.voted_by.username} voted {self.option.option_text}"
    