from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    """
    Validates the input data for our prediction model.
    """
    # These fields match the 'features' list from our Colab notebook
    Airline = serializers.CharField()
    AirportFrom = serializers.CharField()
    AirportTo = serializers.CharField()
    DayOfWeek = serializers.IntegerField()
    Time = serializers.IntegerField()
    Length = serializers.IntegerField()