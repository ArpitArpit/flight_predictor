from rest_framework import generics, permissions
from .models import Subscription
from .serializers import SubscriptionSerializer

class SubscriptionListCreateView(generics.ListCreateAPIView):
    """
    API view for listing a user's subscriptions or creating a new one.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]  # <-- This protects the endpoint

    def get_queryset(self):
        # Only return subscriptions belonging to the currently logged-in user
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the new subscription
        serializer.save(user=self.request.user)

class SubscriptionDetailView(generics.RetrieveDestroyAPIView):
    """
    API view for retrieving or deleting one of the current user's subscriptions.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)