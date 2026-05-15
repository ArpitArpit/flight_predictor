from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        # We only need the flight_id from the user,
        # 'user' will be added automatically from the request
        fields = ['id', 'flight', 'user', 'status', 'subscribed_at']
        read_only_fields = ['user', 'status', 'subscribed_at']