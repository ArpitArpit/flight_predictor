from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import PredictionInputSerializer
from .predictor import FlightPredictor
import requests
import os

# --- Module 4: Propagating Delay Analyzer Logic ---

def get_incoming_status(flight_number):
    """
    [HELPER FUNCTION] Simulates checking the real-time status of the aircraft.
    
    NOTE: In a production system, this function would use the AERODATABOX_API_KEY 
    (from the .env file) to call an external flight tracking API.
    """
    # For this project, we use simple logic to demonstrate the concept:
    if flight_number.endswith('37'):
        # Flights ending in 37 are simulated as being at high risk of delay
        print(f"Propagating Logic: High Risk Detected for {flight_number}")
        return "Delayed"
    return "OnTime"

# --------------------------------------------------

class PredictView(APIView):
    """
    API endpoint for making a flight delay prediction.
    Requires authentication (permissions.IsAuthenticated).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Validate the input data
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        input_data = serializer.validated_data
        
        # We must also retrieve the flight number to run the propagating logic
        flight_number = request.data.get('flight_number', 'N/A')

        # Initialize the predictor instance here (avoids MemoryError at server startup)
        predictor = FlightPredictor()
        
        # 2. Get Base Probability from ML Model (Module 3)
        probability = predictor.predict(input_data)
        
        # 3. Apply Propagating Delay Logic (Module 4)
        incoming_status = get_incoming_status(flight_number)
        
        # Rule: If the incoming flight is late, increase the delay probability
        if incoming_status == "Delayed":
            # Increase probability by 20% (multiplied by 1.2), but cap it at 0.95
            final_probability = min(probability * 1.2, 0.95) 
        else:
            final_probability = probability

        # 4. Return Final Response
        return Response(
            {"flight_number": flight_number,
             "base_probability": probability,
             "final_delay_risk": final_probability,
             "propagating_status": incoming_status
            }, 
            status=status.HTTP_200_OK
        )