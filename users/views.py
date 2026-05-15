from rest_framework import generics, status, permissions # <-- Add 'permissions' here
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer

class RegisterView(generics.CreateAPIView):
    """
    API view for user registration.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny] # <-- FIX: Allow access to everyone

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {"message": "User registered successfully"}, 
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    """
    API view for user login. Returns an auth token upon successful authentication.
    """
    permission_classes = [permissions.AllowAny] # <-- FIX: Allow access to everyone

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Login successful',
                'token': token.key,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid email or password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )