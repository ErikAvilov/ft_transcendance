from django.http import JsonResponse
from django.conf import settings
from .models import *
from .forms import *
import os
from django.utils import timezone

import pyotp
import base64
import qrcode
from io import BytesIO

import PIL.Image as Image

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def qr_to_base64(qr):
    img_stream = BytesIO()
    qr.save(img_stream, format='PNG')
    img_stream.seek(0)
    img_str = base64.b64encode(img_stream.getvalue()).decode('utf-8')
    return img_str

@api_view(['POST']) # A retirer
@permission_classes([IsAuthenticated])
def saveProfileSettings(request):
	context = {}
	try:
		if len(request.POST.get('displayname')) > 151 or len(request.POST.get('displayname')) < 3:
			raise ValueError("Incorrect username format")
	except :
		return JsonResponse({"success" : False, 'error': "Incorrect or missing displayname format"})
	if 'image' in request.FILES:
		image = request.FILES['image']
		try :
			im = Image.open(image)
			im.verify()
		except :
			return JsonResponse({"success" : False, 'error': 'Choisis une image correcte bouffon'})
		existing_images = [file for file in os.listdir(settings.STATIC_ROOT + "media/") if request.user.username in file]
		if existing_images:
			for existing_image in existing_images:
				os.remove(os.path.join(settings.STATIC_ROOT + "media/", existing_image))
		new_name = request.user.username + pyotp.random_base32() + ".png"
		image.name = new_name
		file_path = os.path.join(settings.STATIC_ROOT + "media", image.name)
		with open(file_path, 'wb+') as destination:
			for chunk in image.chunks():
				destination.write(chunk)
		
		context['path'] = image.name
		request.user.userprofile.profile_pic = image.name
		request.user.userprofile.last_updated = timezone.now()
	if (request.POST.get('email') != "" and type(request.POST.get('email')) == str):
		try:
			validate_email(request.POST.get('email'))
			request.user.email = request.POST.get('email')
		except :
			return JsonResponse({'success': False, 'error': 'Wrong email format'})
	try:
		if UserProfile.objects.filter(name=request.POST.get('displayname')).exists() is False and request.POST.get('displayname') != "" and type(request.POST.get('displayname')) == str:
			if request.POST.get('displayname').find('_(42)') == -1:
				request.user.userprofile.name = request.POST.get('displayname')
			else :
				return JsonResponse({'success': False, 'error': 'Forbidden username format'})
	except:
		return JsonResponse({"success" : False, 'error': 'Incorrect username format'})
	request.user.userprofile.save()
	request.user.save()
	context['success'] = True
	return JsonResponse(context)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def	toggleTfa(request):
	if request.user.userprofile.tfa_enabled == True:
		return JsonResponse({'success': False, 'message': 'You already have 2FA enabled'})
	request.user.userprofile.generate_qr_code()
	totp = pyotp.TOTP(request.user.userprofile.otp_base32)
	qr = qrcode.make(totp.provisioning_uri(request.user.userprofile.email, issuer_name='El_Transcendancio'))
	img = qr_to_base64(qr)
	return JsonResponse({'success': True, 'img': img, 'code': request.user.userprofile.otp_base32})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validateTfa(request):
	totp_code = request.POST.get('totp_code')
	if type(totp_code) is not str or type(request.user.userprofile.otp_base32) is not str:
		return JsonResponse({'success': False})
	temp_totp = pyotp.TOTP(request.user.userprofile.otp_base32)
	if temp_totp.verify(totp_code):
		request.user.userprofile.tfa_enabled = True
		request.user.userprofile.save()
		request.user.save()
		return JsonResponse({'success': True})
	return JsonResponse({'success': False, 'error': 'Incorrect code'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def	disableTfa(request):
	request.user.userprofile.tfa_enabled = False
	request.user.userprofile.save()
	request.user.save()
	return JsonResponse({'success': True, 'message': '2FA disabled'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def	userExists(request):
	name = request.GET.get('username')
	if UserProfile.objects.filter(name=name).exists() is True:
		return JsonResponse({'success': True, 'message': f'id = {UserProfile.objects.get(name=name).id}', 'id': UserProfile.objects.get(name=name).id})
	return JsonResponse({'success': False, 'message': 'Username does not exist'})

