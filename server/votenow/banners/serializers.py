from rest_framework import serializers 
from .models import Banner 

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner 
        fields = ["id", "poll", "title", "image", "created_at"]
    
    def to_representation(self, instance):
        """Convert image to absolute URL when reading"""
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            representation['image'] = request.build_absolute_uri(instance.image.url)
        return representation