from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm

from django.http import HttpResponse
from .models import *

from .forms import *
from .decorators import *
from friend.utils import get_friend_request_or_false
from friend.friend_request_status import FriendRequestStatus
from friend.models import *

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

from game.languages import *

def langPref(request):
	if request.user.is_authenticated:
		PreferredLanguage = request.user.PreferredLanguage
		if PreferredLanguage == 'French':
			lang, created = French.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'English':
			lang, created = English.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'Russian':
			lang, created = Russian.objects.get_or_create(pk=1)
	else:
		lang, created = English.objects.get_or_create(pk=1)
	return lang

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def accountSettings(request):
	context = {}
	context['success'] = True
	user = request.user
	UserProfile = request.user.userprofile
	context['profile_pic'] = UserProfile.profile_pic
	account = request.user
	try:
		friend_list = FriendList.objects.get(user=account)
	except FriendList.DoesNotExist:
		friend_list = FriendList(user=account)
		friend_list.save()

	friends = friend_list.friends.all()
	context['friends'] = friends
	
	form = UserProfileForm(instance=user, initial={'name': UserProfile.name})
	is_self = True
	is_friend = False 
	if user.is_authenticated and user != account:
		is_self = False
		if friends.filter(pk=user.id):
			is_friend = True
		else:
			is_friend = False
			if get_friend_request_or_false(sender=account, receiver=user) != False:
				request_sent = FriendRequestStatus.THEM_SENT_TO_YOU.values
				context['pending_friend_request_id'] = get_friend_request_or_false(sender=account, receiver=user).id
			elif get_friend_request_or_false(sender=user, receiver=account) != False:
				request_sent = FriendRequestStatus.YOU_SENT_TO_THEM.value
			else:
				request_sent = FriendRequestStatus.NO_REQUEST_SENT.value
	elif not user.is_authenticated:
		is_self = False
	else:
		try:
			friend_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
		except:
			pass

	context['is_self'] = is_self
	context['is_friend'] = is_friend
	context['user_id'] = user.id
	context['last_updated'] = account.userprofile.last_updated
	context['username'] = account.username
	print(UserProfile.profile_pic)

	if request.user.is_authenticated:
		PreferredLanguage = request.user.PreferredLanguage
		if PreferredLanguage == 'French':
			lang, created = French.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'English':
			lang, created = English.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'Russian':
			lang, created = Russian.objects.get_or_create(pk=1)
	else:
		lang, created = English.objects.get_or_create(pk=1)
	if request.method == 'POST':
		form = UserProfileForm(request.POST, request.FILES, instance=UserProfile)
		if form.is_valid():
			form.save()
	context['form'] = form
	context['lang'] = lang

	return render(request, 'accounts/account_settings.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accountView(request):
	user_id = request.GET.get('user_id')
	if user_id is None:
		user_id = request.user.userprofile.id
	elif UserModel.objects.filter(id=user_id).exists() is False:
		return HttpResponse("invalid user id")
	context = {}
	if request.user.is_authenticated:
		PreferredLanguage = request.user.PreferredLanguage
		if PreferredLanguage == 'French':
			lang, created = French.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'English':
			lang, created = English.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'Russian':
			lang, created = Russian.objects.get_or_create(pk=1)
	else:
		lang, created = English.objects.get_or_create(pk=1)
	context['lang'] = lang
	try:
		account = UserProfile.objects.get(pk=user_id)
	except:
		return render(request, 'accounts/error_page.html', context)
	if account:
		context['id'] = account.id
		context['display_name'] = account.name
		context['username'] = request.user.username
		context['email'] = account.user.email
		context['profile_image'] = account.profile_pic
		context['account'] = account
		context['is_online'] = account.status
		context['last_updated'] = account.last_updated

		try:
			friend_list = FriendList.objects.get(user=account.user)
		except FriendList.DoesNotExist:
			friend_list = FriendList(user=account.user)
			friend_list.save()
		friends = friend_list.friends.all()
		context['friends'] = friends
	
		is_self = True
		is_friend = False
		request_sent = FriendRequestStatus.NO_REQUEST_SENT.value
		friend_requests = None
		user = request.user
		if user.is_authenticated and user != account.user:
			is_self = False
			if friends.filter(pk=user.id):
				is_friend = True
			else:
				is_friend = False
				if get_friend_request_or_false(sender=account.user, receiver=user) != False:
					request_sent = FriendRequestStatus.THEM_SENT_TO_YOU.value
					context['pending_friend_request_id'] = get_friend_request_or_false(sender=account.user, receiver=user).id
				elif get_friend_request_or_false(sender=user, receiver=account.user) != False:
					request_sent = FriendRequestStatus.YOU_SENT_TO_THEM.value
				else:
					request_sent = FriendRequestStatus.NO_REQUEST_SENT.value
		
		elif not user.is_authenticated:
			is_self = False
		else:
			try:
				friend_requests = FriendRequest.objects.filter(receiver=user, is_active=True)
			except:
				pass

		context['is_self'] = is_self
		context['is_friend'] = is_friend
		context['request_sent'] = request_sent
		context['friend_requests'] = friend_requests
		context['account'] = account
	return render(request, 'accounts/account.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def games_history(request):
	context = {}
	if request.user.is_authenticated:
		PreferredLanguage = request.user.PreferredLanguage
		if PreferredLanguage == 'French':
			lang, created = French.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'English':
			lang, created = English.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'Russian':
			lang, created = Russian.objects.get_or_create(pk=1)
	else:
		lang, created = English.objects.get_or_create(pk=1)
	context['lang'] = lang
	query = Game.objects.all()
	label = []
	data = []

	user = request.user
	user_id = request.GET.get('user_id')
	if user_id is None:
		user_id = request.user.userprofile.id
	try:
		user1= UserModel.objects.get(pk=user_id)
	except:
		return render(request, 'accounts/error_page.html', context)

	games1 = Game.objects.filter(player1=user1)
	games2  = Game.objects.filter(player2=user1)
	games = games1 | games2
	context['games'] = games 
	wins = Game.objects.filter(winner=user1).count()
	lose = Game.objects.filter(loser=user1).count()
	context['wins'] = wins
	context['lose'] = lose
	data.append(lose)
	data.append(wins)
	context['data'] = data
	context['label'] = label 
	if (wins + lose > 0):
		winrate = (wins / (wins + lose)) * 100  
		context['winrate'] = winrate
	return render(request, "accounts/game_history.html", context)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_details(request):
	game_id = request.GET.get('game_id')
	context = {}
	data = []
	if request.user.is_authenticated:
		PreferredLanguage = request.user.PreferredLanguage
		if PreferredLanguage == 'French':
			lang, created = French.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'English':
			lang, created = English.objects.get_or_create(pk=1)
		elif PreferredLanguage == 'Russian':
			lang, created = Russian.objects.get_or_create(pk=1)
	else:
		lang, created = English.objects.get_or_create(pk=1)
	context['lang'] = lang
	try:
		game = Game.objects.get(pk=game_id)
	except:
		return render(request, 'accounts/error_page.html', context)
	context['winner'] = game.winner.username
	context['loser'] = game.loser.username
	context['winnerscore'] = game.winnerscore
	if game.loserscore == -1:
		game.loserscore = 0
	context['loserscore'] = game.loserscore
	context['date'] = game.date_created.strftime("%Y / %m / %d : %H:%M")
	data.append(game.winnerscore)
	data.append(game.loserscore)
	context['data'] = data
	return render(request, "accounts/game_details.html", context)

@api_view(['GET'])
@permission_classes([AllowAny])
def loadRegister(request):
	context = {}
	lang = langPref(request)
	context['lang'] = lang
	context['regForm'] = UserRegisterForm(auto_id="register_%s")
	return render(request, "accounts/register.html", context)

@api_view(['GET'])
@permission_classes([AllowAny])
def loadLogin(request):
	context = {}
	lang = langPref(request)
	context['lang'] = lang
	context['form'] = AuthenticationForm()
	return render(request, "accounts/login.html", context)
	