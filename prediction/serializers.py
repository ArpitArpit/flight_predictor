from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    """
    Validates the input data for our prediction model.
    """
    flight_number = serializers.CharField(required=False, allow_blank=True)
    # These fields match the 'features' list from our Colab notebook
    Airline = serializers.CharField()
    AirportFrom = serializers.CharField()
    AirportTo = serializers.CharField()
    DayOfWeek = serializers.IntegerField()
    Time = serializers.IntegerField()
    Length = serializers.IntegerField()