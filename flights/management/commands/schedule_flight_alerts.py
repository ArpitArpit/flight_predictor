from django.core.management.base import BaseCommand

from flights.tasks import check_and_alert


class Command(BaseCommand):
    help = 'Schedule the recurring flight alert background task.'

    def handle(self, *args, **options):
        check_and_alert(
            repeat=300,
            repeat_until=None,
            verbose_name='flights.tasks.check_and_alert',
            remove_existing_tasks=True,
        )
        self.stdout.write(self.style.SUCCESS('Scheduled recurring flight alert task.'))
