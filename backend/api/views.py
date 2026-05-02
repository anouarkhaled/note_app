from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .serializers import NoteSerializer
from .agent import start_agent, confirm_agent

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
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

class AgentNoteView(APIView):
    """POST with {message} → returns preview {status, title, content, thread_id}
       POST with {thread_id, confirmed} → saves or discards the note"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        thread_id = request.data.get("thread_id")

        # Step 2: user confirmed or cancelled
        if thread_id:
            confirmed = request.data.get("confirmed", False)
            try:
                note = confirm_agent(thread_id, request.user, confirmed)
                if not confirmed or note is None:
                    return Response({"status": "cancelled"}, status=status.HTTP_200_OK)
                return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Step 1: generate preview
        user_input = request.data.get("message", "").strip()
        if not user_input:
            return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            preview = start_agent(user_input, str(request.user.id))
            preview["thread_id"] = str(request.user.id)
            return Response(preview, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    