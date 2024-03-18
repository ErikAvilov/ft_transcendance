from django.forms import ModelForm
from .models import *
from django import forms
from django.forms import ModelForm, TextInput
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class CreateUserForm(UserCreationForm):
	class Meta:
		model = User
		fields = ['username', 'email', 'password1', 'password2']
		widgets = {
            'username': TextInput(attrs={'autocomplete': 'username'})
        }

	def clean_username(self):
			username = self.cleaned_data.get('username')
			if len(username) > 40:
				raise forms.ValidationError("Le nom ne peut pas dépasser 40 caractères.")
			return username


class UserProfileForm(ModelForm):
	class Meta:
		model = UserProfile
		fields = ['name', 'email', 'profile_pic']
		exclude = ['user']
		widgets = {
            'name': TextInput(attrs={'autocomplete': 'username'})
        }
	def clean_name(self):
		name = self.cleaned_data.get('name')
		if len(name) > 40:
			raise forms.ValidationError("Le nom ne peut pas dépasser 40 caractères.")
		return name

class UserRegisterForm(UserCreationForm):
	class Meta:
		model = UserModel
		fields = ['username', 'email', 'password1', 'password2']
		widgets = {
            'username': TextInput(attrs={'autocomplete': 'username'})
        }
		def clean_username(self):
			username = self.cleaned_data.get('username')
			if len(username) > 40:
				raise forms.ValidationError("Le nom ne peut pas dépasser 40 caractères.")
			return username
