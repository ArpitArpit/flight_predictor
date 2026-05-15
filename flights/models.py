from django.db import models

class Flight(models.Model):
    flight_number = models.CharField(max_length=50)
    origin_airport = models.CharField(max_length=10)
    destination_airport = models.CharField(max_length=10)
    scheduled_departure = models.DateTimeField()
    aircraft_tail_number = models.CharField(max_length=20, blank=True, null=True)
    
    # These fields will be updated by our AI
    last_base_prediction = models.FloatField(null=True, blank=True)
    last_final_prediction = models.FloatField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.flight_number} - {self.origin_airport} to {self.destination_airport}"