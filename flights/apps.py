from django.apps import AppConfig

class FlightsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'flights'

    def ready(self):
        # Import task when app is ready
        from . import tasks 

        # Schedule the task to run once, and then repeat every 5 minutes
        # We use 'flights.tasks.check_and_alert' as the unique queue name
        tasks.check_and_alert(repeat=300, repeat_until=None, verbose_name='flights.tasks.check_and_alert')