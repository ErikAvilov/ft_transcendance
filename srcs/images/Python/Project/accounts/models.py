from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from friend.models import *
from django.contrib.auth.models import AbstractUser, Group, Permission
import pyotp
from django.contrib.auth import get_user_model

class UserModel(AbstractUser):
	PreferredLanguage = models.CharField(max_length=10, default="English")

	groups = models.ManyToManyField(Group, related_name='usermodel_groups', blank=True)
	user_permissions = models.ManyToManyField (
		Permission, related_name='usermodel_user_permissions', blank=True
	)

	def enable_otp(self):
		self.otp_enabled = True
		self.save()
	   
	def disable_otp(self):
		self.otp_enabled = False
		self.save()

	def swToFrench(self):
		self.PreferredLanguage = 'French'
		self.save()

	def swToEnglish(self):
		self.PreferredLanguage = 'English'
		self.save()

	def swToRussian(self):
		self.PreferredLanguage = 'Russian'
		self.save()

User = get_user_model()
class Message(models.Model):
	message = models.JSONField()
	user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, blank=True)

class	UserProfile(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
	#id = models.AutoField(primary_key=True)
	#user_id = models.CharField(max_length=6)
	tfa_enabled = models.BooleanField(default=False)
	otp_base32 = models.CharField(max_length=255, null=True)
	token = models.CharField(max_length=255)
	name = models.CharField(max_length=151)
	picUrl = models.CharField(max_length=255)
	password = models.CharField(max_length=255)
	date_created = models.DateTimeField(auto_now_add=True, null=True)
	email = models.EmailField(max_length=200, null=True)
	profile_pic = models.ImageField(default="profile1_(42)_(42).png", null=True, blank=True)
	api_token = models.CharField(max_length=255)
	status = models.BooleanField(default=False)
	tournament = models.IntegerField(default=0)
	last_updated = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"UserProfile for {self.name}"

	def	saveImage(self, image):
		self.profile_pic = image
		self.save()

	def	save2FaToken(self, token):
		self.token = pyotp.randon_base32()
		self.tfa_enabled = True
		self.save()
	
	def generate_qr_code(self):
		self.otp_base32 = pyotp.random_base32()
		self.save()
	
	def update_name(self):
		self.name = self.user.username
		self.save()

class Game(models.Model):
	name = models.CharField(max_length=200, null=True, blank=True, default="game")
	date_created = models.DateTimeField(auto_now_add=True, null=True)
	player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='player1', on_delete=models.CASCADE)
	player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='player2', on_delete=models.CASCADE)
	winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='winner', on_delete=models.CASCADE)
	loser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='loser', on_delete=models.CASCADE)
	player1score = models.IntegerField(null=True, blank=True,)
	player2score = models.IntegerField(null=True, blank=True,)
	loserscore = models.IntegerField(null=True, blank=True,)
	winnerscore = models.IntegerField(null=True, blank=True,)
	def __str__(self):
		return self.name

"""
class Player(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='player1', on_delete=models.CASCADE)
	result = models.BooleanField()
	scored = models.IntegerField(null=True, blank=True,)
	taken = models.IntegerField(null=True, blank=True,)
"""

@receiver(post_save, sender=UserModel)
def create_profile(sender, instance, created, **kwargs):
	if created:
		UserProfile.objects.create(user=instance, name=instance.username)
		profile = UserProfile.objects.get(user=instance, name=instance.username)
		profile.update_name()
		FriendList.objects.get_or_create(user=instance)

"""
@receiver(post_save, sender=User)
def update_profile(sender, instance, created, **kwargs):
	if created == False:
		instance.profile.save()
		print('profile updated !')
"""
