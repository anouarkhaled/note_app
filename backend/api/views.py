from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Note
from .serializers import NoteSerializer

class UserCreateView(generics.CreateAPIView):
    """This view allows anyone to create a new user account."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
class NoteListCreateView(generics.ListCreateAPIView):
    """This view allows authenticated users to list all notes and create new notes."""
   
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        """When creating a new note, automatically set the author to the currently logged-in user."""
        if serializer.is_valid():
          serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
class NoteDeleteView(generics.DestroyAPIView):
    """This view allows authenticated users to delete their own notes."""
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    