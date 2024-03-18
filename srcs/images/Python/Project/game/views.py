from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.conf import settings
from django.shortcuts import render, redirect, HttpResponseRedirect
from django.http import JsonResponse
from django.middleware.csrf import get_token

import json

from .utils import *

from accounts.forms import *
from accounts.models import *
from .models import *

from django.core.validators import validate_email

import pyotp
import requests
import base64

from .languages import *

from game.static.python.ext import ctx

from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
REDIRECT_URL = 'https://' + settings.SERVER_IP + ':8000/'
CALLBACK = REDIRECT_URL + 'callback/'

@api_view(['GET'])
@permission_classes([AllowAny])	
def start(request):
	return render(request, 'start.html')

@api_view(['GET'])
@permission_classes([AllowAny])	
def home(request):
	lang, created = English.objects.get_or_create(pk=1)
	context = {
		'var' : str(json.dumps(ctx.__dict__)),
		'form' : AuthenticationForm(),
		'regForm' : UserRegisterForm(auto_id="register_%s"),
		'lang' : lang,
		'username': request.user.username if request.user.is_authenticated else 'usurpateur',
	}
	return render(request, 'game.html', context)

@api_view(['GET'])
@permission_classes([AllowAny])
def authenticate_42(request):
	if request.user.is_authenticated:
		return redirect('game')
	totp_code = request.GET.get('code', None)
	state_data = {
		'totp_code': totp_code
	}
	state_encoded = base64.urlsafe_b64encode(json.dumps(state_data).encode()).decode()
	auth_params = {
		'client_id': settings.CLIENT_ID, # UID given by the 42 application
		'redirect_uri': CALLBACK, # yes it's called urI, idk why, it's the url used in the application
		'scope': 'scope',
		'response_type': 'code',
		'state': state_encoded,
		'totp_code': totp_code
	}
	auth_url = f"{settings.OAUTH_URL}?client_id={settings.CLIENT_ID}&redirect_uri={CALLBACK}&scope={'public'}&response_type=code&state={state_encoded}"
	return redirect(auth_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def callback(request):
	print('============================================')
	if request.user.is_authenticated:
		return JsonResponse({'success': False, 'message': 'User already authenticated'})
	token_params = {
		'grant_type': 'authorization_code',
		'code': request.GET.get('code'),
		'redirect_uri': CALLBACK,
		'client_id': settings.CLIENT_ID,
		'client_secret': settings.CLIENT_SECRET 
	}
	response = requests.post(TOKEN_URL, data=token_params)
	if response.status_code == 200:
		try:
			ret = HttpResponseRedirect('/')
			access_token = response.json()['access_token']
			profile_url = "https://api.intra.42.fr/v2/me"
			headers = {"Authorization": f"Bearer {access_token}"}
			token_response = requests.get(profile_url, headers=headers)
			username = token_response.json().get('login') + '_(42)'
			password = 'anasmaxkk5'
			email = token_response.json().get('email')
			picUrl = token_response.json().get('image', {}).get('versions', {}).get('medium')
			if UserModel.objects.filter(username=username).exists():
				if verifyTfa(username, request.GET.get('state')) == True:
					user = authenticate(username=username, password=password)
					login(request, user)
					#jwt
					myobj = {'username': username, 'password': password,}
					response = requests.post(REDIRECT_URL + 'api/token/', json=myobj, verify=False)
					if response.status_code == 200:
						res_dict = json.loads(response.text)
						ret.set_cookie("access", res_dict['access'])
						ret.set_cookie("refresh", res_dict['refresh'])
					else:
						print("request failed")
				else:
					return ret
				return ret

			oauth_data = {'username': 'temporary_username',
						'email': email,
						'password1': password, 'password2': password}
			form = UserRegisterForm(oauth_data)
			if form.is_valid():
				user_profile = form.save(commit=False)
				user_profile.username = username
				user_profile.save()
				user_pic = UserProfile.objects.get(name=username)
				user_pic.saveImage(save42Image(picUrl, username))
				user = authenticate(request, username=username, password=password)
				login(request, user)

				#jwt
				myobj = {'username': username, 'password': password,}
				response = requests.post('https://0.0.0.0:8000/api/token/', json=myobj, verify=False)
				if response.status_code == 200:
					print("request succesfull")
					res_dict = json.loads(response.text)
					ret.set_cookie("access", res_dict['access'])
					ret.set_cookie("refresh", res_dict['refresh'])
				else:
					print("request fail")
			else:
				return redirect('game')
			return ret
		except Exception as e:
			print(e)
			return redirect('game')
	else:
		print(f'error: {response.status_code}')
		return redirect('game')


# -- Frigo -- #

@api_view(['POST']) # still need to be validated
@permission_classes([AllowAny])
def register(request):
	print ("===============", request.POST, "========================")
	if request.method == 'POST':
		try:
			if request.POST.get('username') is None or request.POST.get('password1') is None or request.POST.get('password2') is None or request.POST.get('email') is None:
				raise ValueError("Missing input")
			if request.POST.get('username').find('_(42)') != -1:
				raise ValueError("Unauthorized authentication method")
			if len(request.POST.get('username')) > 151 or len(request.POST.get('password1')) > 128 or len(request.POST.get('password2')) > 128:
				raise ValueError("Incorrect input format")
			if request.POST.get('password1') != request.POST.get('password2'):
				raise ValueError("Passwords do not match")
			if len(request.POST.get('password1')) < 8:
				raise ValueError("Password too short")
			if len(request.POST.get('username')) < 3:
				raise ValueError("Username too short")
			if len(request.POST.get('username')) > 150:
				raise ValueError("Username too long")
			if len(request.POST.get('email')) > 254:
				raise ValueError("Email too long")
			if len(request.POST.get('email')) < 3:
				raise ValueError("Email too short")
			if UserProfile.objects.filter(name=request.POST.get('username')).exists():
				raise ValueError("Username already taken")
			if UserProfile.objects.filter(email=request.POST.get('email')).exists():
				raise ValueError("Email already taken")
			if not request.POST.get('email').find('@') != -1:
				raise ValueError("Invalid email")
			email = request.POST.get('email', '').strip()
			validate_email(email)
		except ValueError as e:
			return JsonResponse({'success': False, 'error': str(e)})
		formData = {'username': request.POST.get('username'),
		'email': request.POST.get('email'),
		'password1': request.POST.get('password1'), 'password2': request.POST.get('password2')}
		
		form = UserRegisterForm(formData)
		if form.is_valid():
			user_profile = form.save(commit=False)
			if UserProfile.objects.filter(name=user_profile.username).exists():
				return JsonResponse({'success': False, 'message': 'username already taken'})
			user_profile.save()
			return JsonResponse({'success': True})
		else:
			errors = dict(form.errors.items())
			print(errors)
			return JsonResponse({'success': False, 'error': errors})
	return JsonResponse({'success': False})


################ login forms ################################################### 

@api_view(['POST'])
@permission_classes([AllowAny])
def Login(request):
	print (f'(login) request method = {request.method}')
	if request.method == 'POST':
		if request.user.is_authenticated:
			return JsonResponse({'success': False, 'message': 'User already authenticated'})
		username = request.POST.get('username')
		password = request.POST.get('password')
		totp_code = request.POST.get('totp_code')

		if username is not None:
			if username.find('_(42)') != -1:
				return JsonResponse({'success': False, 'message': 'Unauthorized authentication method'})
		user = authenticate(request, username=username, password=password)
		if user is not None:
			user_profile = UserModel.objects.get(username=username)
			if user_profile.userprofile.tfa_enabled == True:
				temp_totp = pyotp.TOTP(user_profile.userprofile.otp_base32)
				if temp_totp.verify(totp_code):
					login(request, user)
					return JsonResponse({'success': True})
				else:
					return JsonResponse({'success': False, 'message': 'Code Invalid'})
			else:
				login(request, user)
				return JsonResponse({'success': True, 'message': 'User logged in'})
		else:
			return JsonResponse({'success': False, 'message': 'Invalid User'})
	return redirect('game')

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
	if request.user.is_authenticated:
		logout(request)
		return JsonResponse({'success': True})
	return JsonResponse({'success': False})

@api_view(['GET'])
def get_csrf_token(request):
	return JsonResponse({'csrf_token' : get_token(request)})