from rest_framework import generics
from .models import Flight
from .serializers import FlightSerializer

class FlightListCreateView(generics.ListCreateAPIView):
    """
    API view for listing all flights or creating a new flight.
    """
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    # We'll make this open for now.
    # A user needs to be able to create a flight entry
    # when they search for one.
    permission_classes = []