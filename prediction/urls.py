from django.urls import path
from .views import PredictView

urlpatterns = [
    path('', PredictView.as_view(), name='make-prediction'),
]