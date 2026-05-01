from django.urls import path
from . import views
urlpatterns = [
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', views.NoteDeleteView.as_view(), name='note-delete'),
]