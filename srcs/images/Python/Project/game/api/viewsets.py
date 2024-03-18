from rest_framework import viewsets
from .serializers import userSerializers
from accounts.models import UserModel


class userviewsets(viewsets.ModelViewSet):
	queryset = UserModel.objects.all()
	serializer_class = userSerializers