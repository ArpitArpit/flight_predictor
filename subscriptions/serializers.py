from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    flight_details = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        # We only need the flight_id from the user,
        # 'user' will be added automatically from the request
        fields = ['id', 'flight', 'flight_details', 'user', 'status', 'subscribed_at']
        read_only_fields = ['user', 'status', 'subscribed_at']

    def get_flight_details(self, obj):
        flight = obj.flight
        return {
            'id': flight.id,
            'flight_number': flight.flight_number,
            'origin_airport': flight.origin_airport,
            'destination_airport': flight.destination_airport,
            'scheduled_departure': flight.scheduled_departure,
            'last_base_prediction': flight.last_base_prediction or 0,
            'last_final_prediction': flight.last_final_prediction or 0,
            'propagating_status': 'Delayed' if flight.flight_number.endswith('37') else 'OnTime',
        }