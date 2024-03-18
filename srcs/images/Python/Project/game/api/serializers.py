from rest_framework import serializers
from accounts.models import UserModel


class userSerializers(serializers.ModelSerializer):

	class Meta:
		model = UserModel
		fields = '__all__'