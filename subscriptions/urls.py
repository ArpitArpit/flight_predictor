from django.urls import path
from .views import SubscriptionDetailView, SubscriptionListCreateView

urlpatterns = [
    path('', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('<int:pk>/', SubscriptionDetailView.as_view(), name='subscription-detail'),
]