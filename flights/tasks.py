from background_task import background
from subscriptions.models import Subscription
from prediction.predictor import FlightPredictor 
from django.core.mail import send_mail
from django.conf import settings


# We use the @background decorator to turn this function into a scheduled task
@background(schedule=300) # Run every 300 seconds (5 minutes)
def check_and_alert():
    # Initialize the predictor once
    predictor = FlightPredictor() 
    print("Running scheduled check for flight alerts...")

    # 1. Iterate over all active subscriptions
    active_subs = Subscription.objects.filter(status='Active')

    for sub in active_subs:
        # Prepare the data needed for prediction (simulated data)
        # NOTE: In a real system, you would fetch this data live from APIs,
        # but for the task logic, we simulate using the required fields.
        input_data = {
            'Airline': 'AA', 
            'AirportFrom': 'JFK', 
            'AirportTo': 'LAX', 
            'DayOfWeek': 5, 
            'Time': 700, 
            'Length': 300
        }

        # 2. Get the Final Prediction from Module 4 Logic
        # We call the core logic we built in the previous step
        final_risk = predictor.predict(input_data) 

        # 3. Decision Logic (Module 6)
        if final_risk > 0.70: # If risk is over 70%
            subject = f"🚨 ALERT: High Delay Risk for Flight {sub.flight.flight_number}"
            message = (f"The final delay probability for your subscribed flight "
                       f"({sub.flight.flight_number}) is now {final_risk:.2f}. "
                       f"This includes the propagation risk analysis.")

            # 4. Send Email (This is placeholder logic)
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER, # From email (needs to be configured)
                [sub.user.email],         # To email
                fail_silently=False,
            )
            print(f"Alert sent to {sub.user.email} for high risk: {final_risk:.2f}")

    print("Alert check complete.")