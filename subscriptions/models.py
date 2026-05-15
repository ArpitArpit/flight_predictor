from django.db import models
from backend.settings import AUTH_USER_MODEL
from flights.models import Flight

class Subscription(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='Active')
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents a user from subscribing to the same flight twice
        unique_together = ('user', 'flight')

    def __str__(self):
        return f"{self.user.email} subscribed to {self.flight.flight_number}"