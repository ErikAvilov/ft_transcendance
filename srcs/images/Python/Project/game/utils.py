from django.http import JsonResponse
import json
import pyotp
import requests
import base64
import os
from django.conf import settings

from accounts.models import *

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changeLanguage(request):
	language = request.POST.get('language')
	if language == 'French':
		request.user.swToFrench()
	if language == 'English':
		request.user.swToEnglish()
	if language == 'Russian':
		request.user.swToRussian()
	return JsonResponse({'success': True})

def	verifyTfa(username, code):
	if UserModel.objects.get(username=username).userprofile.tfa_enabled == True:
		state_decoded = base64.urlsafe_b64decode(code.encode()).decode()
		state_data = json.loads(state_decoded)
		code_ = state_data.get('totp_code')
		temp_totp = pyotp.TOTP(UserModel.objects.get(username=username).userprofile.otp_base32)
		if temp_totp.verify(code_):
			return True
		else:
			return False
	return True

def save42Image(url, username):
    img = requests.get(url)
    if img.status_code == 200:
        file_name = username + pyotp.random_base32() + '.png'
        file_path = os.path.join(settings.STATIC_ROOT + 'media/', file_name)
        with open(file_path, 'wb') as f:
            f.write(img.content)
        return file_name