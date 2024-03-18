from django.shortcuts import render, redirect
from django.http import HttpResponse
import json

from accounts.models import UserModel
from friend.models import FriendRequest, FriendList
from accounts.models import *

from game.languages import *

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friends_list_view(request, *args, **kwargs):
	context = {}
	user = request.user
	print("My id :", user.id," Name of myself", user.username," Status of myself: ",user.userprofile.status)
	if user.is_authenticated:
		user_id = request.user.id
		if user_id:
			try:
				this_user = UserModel.objects.get(pk=user_id)
				context['this_user'] = this_user
			except UserModel.DoesNotExist:
				return HttpResponse("That user does not exist.")
			try:
				friend_list = FriendList.objects.get(user=this_user)
			except FriendList.DoesNotExist:
				return HttpResponse(f"Could not find a friends list for {this_user.username}")

			if user != this_user:
				if not user in friend_list.friends.all():
					return HttpResponse("You must be friends to view their friends list.")
			friends = []
			auth_user_friend_list = FriendList.objects.get(user=user)
			for friend in friend_list.friends.all():
				friends.append((friend, auth_user_friend_list.is_mutual_friend(friend)))
			context['friends'] = friends
	
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
	return render(request, "friend/friend_list.html", context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friend_requests(request, *args, **kwargs):
	context = {}
	user = request.user
	try:
		if user.is_authenticated:
			user_id = request.user.id
			account = UserModel.objects.get(pk=user_id)
			if account == user:
				friend_requests = FriendRequest.objects.filter(receiver=account, is_active=True)
				context['friend_requests'] = friend_requests
			else:
				return HttpResponse("You can't view another users friend requets.")
		else:
			redirect("game")
	except Exception as e:
		print(f'error = {e}')

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
	return render(request, "friend/friend_requests.html", context)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request, *args, **kwargs):
	user = request.user
	payload = {}
	if request.method == "POST" and user.is_authenticated:
		try :
			user_id = int(request.POST.get("id"))
		except :
			payload['response'] = 'Requested User_id not found'
			return HttpResponse(json.dumps(payload), content_type="application/json")
		if user_id:
			if UserModel.objects.filter(id=user_id).exists() is False:
				payload['response'] = 'Requested User_id not found'
				return HttpResponse(json.dumps(payload), content_type="application/json")
			receiver = UserModel.objects.get(pk=user_id)
			for friend in FriendList.objects.get(user=request.user).friends.all(): # check la liste d'ami du sender avant d'envoyer la requête
				if friend.username == receiver.username:							# Alors la méthode ressemble beaucoup à du cpp mais je vous emmerde
					payload['response'] = 'Already friends'
					return HttpResponse(json.dumps(payload), content_type="application/json")
			if request.user.username == receiver.username:
				payload['response'] = "You can't invite yourself dummy"
				return HttpResponse(json.dumps(payload), content_type="application/json")
			try:
				friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver)
				try:
					for request in friend_requests:
						if request.is_active:
							raise Exception("You already sent them a friend request.")
					friend_request = FriendRequest(sender=user, receiver=receiver)
					friend_request.save()
					payload['response'] = "Friend request sent."
				except Exception as e:
					payload['response'] = str(e)
			except FriendRequest.DoesNotExist:
				friend_request = FriendRequest(sender=user, receiver=receiver)
				friend_request.save()
				payload['response'] = "Friend request sent."
			if payload['response'] == None:
				payload['response'] = "Something went wrong."
		else:
			payload['response'] = "Unable to send a friend request."
	else:
		payload['response'] = "You must be authenticated to send a friend request."
	return HttpResponse(json.dumps(payload), content_type="application/json")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, *args, **kwargs):
	user = request.user
	payload = {}
	if request.method == "GET" and user.is_authenticated:
		friend_request_id = kwargs.get("friend_request_id")
		if friend_request_id:
			try:
				friend_request = FriendRequest.objects.get(pk=friend_request_id)
			except :
				return HttpResponse("unvalid friend request id")
			if friend_request is not None:
				if friend_request.receiver == user:
					if friend_request:
						updated_notification = friend_request.accept()
						payload['response'] = "Friend request accepted."

					else:
						payload['response'] = "Something went wrong."
				else:
					payload['response'] = "That is not your request to accept."
			else:
				return HttpResponse("something went wrong.")
		else:
			payload['response'] = "Unable to accept that friend request."
	else:
		payload['response'] = "You must be authenticated to accept a friend request."
	return HttpResponse(json.dumps(payload), content_type="application/json")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_friend(request, *args, **kwargs):
	user = request.user
	payload = {}
	if request.method == "POST" and user.is_authenticated:
		user_id = request.POST.get("id")
		if user_id:
			try:
				removee = UserModel.objects.get(pk=user_id)
				friend_list = FriendList.objects.get(user=user)
				friend_list.unfriend(removee)
				payload['response'] = "Successfully removed that friend."
			except Exception as e:
				payload['response'] = f"Something went wrong: {str(e)}"
		else:
			payload['response'] = "There was an error. Unable to remove that friend."
	else:
		payload['response'] = "You must be authenticated to remove a friend."
	return HttpResponse(json.dumps(payload), content_type="application/json")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def decline_friend_request(request, *args, **kwargs):
	user = request.user
	payload = {}
	if request.method == "GET" and user.is_authenticated:
		friend_request_id = kwargs.get("friend_request_id")
		if FriendRequest.objects.filter(id=friend_request_id).exists() is False:
			return HttpResponse("wrong friend request id")
		if friend_request_id:
			friend_request = FriendRequest.objects.get(pk=friend_request_id)
			if friend_request is not None:
				if friend_request.receiver == user:
					if friend_request:
						updated_notification = friend_request.decline()
						payload['response'] = "Friend request declined."
					else:
						payload['response'] = "Something went wrong."
				else:
					payload['response'] = "That is not your friend request to decline."
			else:
				payload['response'] = "That is not your friend request to decline."
		else:
			payload['response'] = "There was an error."
	else:
		payload['response'] = "You must be authenticated to decline a friend request."
	return HttpResponse(json.dumps(payload), content_type="application/json")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_friend_request(request, *args, **kwargs):
	user = request.user
	payload = {}
	if request.method == "POST" and user.is_authenticated:
		try :
			user_id = int(request.POST.get("receiver_user_id"))
		except :
			payload['response'] = 'Requested User_id not found'
			return HttpResponse(json.dumps(payload), content_type="application/json")
		if user_id:
			try:
				receiver = User.objects.get(pk=user_id)
			except :
				return HttpResponse(json.dumps(payload), content_type="application/json")
			try:
				friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver, is_active=True)
			except FriendRequest.DoesNotExist:
				payload['response'] = "Nothing to cancel. Friend request does not exist."
			if len(friend_requests) > 1:
				for request in friend_requests:
					request.cancel()
				payload['response'] = "Friend request canceled."
			else:
				friend_requests.first().cancel()
				payload['response'] = "Friend request canceled."
		else:
			payload['response'] = "Unable to cancel that friend request."
	else:
		payload['response'] = "You must be authenticated to cancel a friend request."
	return HttpResponse(json.dumps(payload), content_type="application/json")