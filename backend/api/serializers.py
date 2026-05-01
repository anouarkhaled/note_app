from django.contrib.auth.models import User
from rest_framework import serializers
#Serializers convert complex data (like Django models) into JSON and vice versa
from .models import Note 
class UserSerializer(serializers.ModelSerializer):
    """defining a serializer called UserSerializer.
It inherits from ModelSerializer, which automatically creates fields based on a Django model.
The Meta class inside UserSerializer specifies that it is based on the User model and includes the id, username, and password fields.Django model.
This saves you from manually defining each field."""
    class Meta:
        #Specifies that this serializer is based on the User model.
        model = User
        #fields that will be included in the serialized output/input.
        fields = ['id', 'username', 'password']
        #The password can be sent to the API (POST/PUT)
        #But it will NOT be returned in responses (important for security)
        extra_kwargs = {'password': {'write_only': True}}
    #It is called when you save a new object using the serializer.
    def create(self, validated_data):
        """create_user() is a special Django method.
It hashes the password properly before saving."""
        user = User.objects.create_user(**validated_data)
        return user
    #**validated_data means: unpack the dictionary and pass each key-value pair as a keyword argument to the function.
class NoteSerializer(serializers.ModelSerializer):
    """This serializer converts Note model instances to and from JSON format."""
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author'] 
        #we can read the author field when we get a note, but we can't set it when creating/updating a note through the API. 
        # This is because we want to automatically set the author to the currently logged-in user in the view, rather than allowing clients to specify it in the request data.
        extra_kwargs = {'author': {'read_only': True}}
    