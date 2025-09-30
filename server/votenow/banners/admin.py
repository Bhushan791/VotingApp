from django.contrib import admin
from .models import Banner 




class AdminBanner(admin.ModelAdmin) :
    list_display = [ "poll", "title", "image", "created_at"] 



admin.site.register( Banner, AdminBanner) 
