from django.urls import path
from .views import FlightListCreateView

urlpatterns = [
    path('', FlightListCreateView.as_view(), name='flight-list-create'),
]