import json
import jsonschema

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
import asyncio

from game.static.python.ext import ctx
from game.static.python.game import simulate
from game.static.python.tournament import tournament_manager
from game.models import Tournament
from copy import deepcopy
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer #WHY ???????????????????????????????????

# from time import sleep
import time as t
import jwt
from accounts.models import UserModel
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.db.models import Count #WHY ???????????????????????????????????
from django.db.models import ObjectDoesNotExist #WHY ???????????????????????????????????

User = get_user_model()

trigger = True

@database_sync_to_async
def get_user_by_username(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return None

class paddle:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.vy = 0
        self.recover = 1
        self.score = 0

class theBall:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.r = ctx.ballr
        self.rv = ctx.ballv
        self.tv = 0

class data_class:
    def __init__(self):
        self.t = 0.1
        self.keys = [False, False, False, False]
        self.ball = theBall()
        self.paddleR = paddle(ctx.width / 2 - ctx.paddled - ctx.paddlew, - ctx.paddleh / 2)
        self.paddleL = paddle(ctx.paddled - ctx.width / 2, - ctx.paddleh / 2)
        self.scored = False
        self.timeSinceRestart = 0
        self.image = 0

def dataToJson(data):
    #print("At beggining of dataToJson: ", data.keys)
    new = deepcopy(data)
    #print("After deepcopy: ", data.keys)
    new.ball = new.ball.__dict__
    new.paddleR = new.paddleR.__dict__
    new.paddleL = new.paddleL.__dict__
    return (new.__dict__)

schema_new_tournament = {
	"type": "object",
	"properties": {
		"type": {"type": "string"},
		"size": {"type": "number"},
		"password": {"type": "string"}
	}
}
schema_join_tournament = {
	"type": "object",
	"properties": {
		"type": {"type": "string"},
		"id": {"type": "number"},
		"password": {"type": "string"}
	}
}
schema_game = {
	"type": "object",
	"properties": {
		"type": {"type": "string"},
		"buffer" : {
            "type": "array",
			"item": {
				"type": "object",
				"properties": {
					"type": {"type": "string"},
					"keys": {
						"type": "array",
						"item": {"type": "boolean"},
						"minItems": 2,
						"maxItems": 2
					},
					"image": {"type": "number"}
					}
				},
			"minItems": 1
			}
		}
}
schema_login = {
	"type": "object",
	"properties": {
		"type": {"type": "string"},
		"jwtToken": {"type": "string"}
	}
}

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = AnonymousUser()
		self.data = data_class()
		self.buffer = [[],[]]
		self.connected = 1
		self.time = 0
		self.adv_id = 0
		self.id = 0
		self.in_tournament = 0
		self.server_group = "None"
		self.room_name = "RDefault"
		self.room_group_name = "Default"
		self.groupname_adversaire = "None"
#		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()
#		await self.send(text_data=json.dumps({"type": "tournament_update", "message": tournament_manager.tournament_json()}))

	async def disconnect(self, close_code):
		self.connected = 0
		if (self.in_tournament != 0):
			await tournament_manager.quit_tournament(self.in_tournament, self.user, self)

	async def receive(self, text_data):
# debug log
		# if self.user != AnonymousUser():
		# 	print("id : ", await get_id(self.user), "status : ", await get_status(self.user))
		try:
			text_data_json = json.loads(text_data)
			if (not ("type" in text_data_json)):
				raise Exception("Missing type")
			if (text_data_json["type"] == "createTournament"):
				if (self.user == AnonymousUser()):
					raise Exception("Not logged in")
				if (await get_tournament(self.user) != 0):
					raise Exception("Already in tournament")
				jsonschema.validate(text_data_json, schema_new_tournament)
				tournament_id = tournament_manager.new_tournament(text_data_json["size"], text_data_json["password"])
				await tournament_manager.join_tournament(tournament_id, self, text_data_json["password"])
				print("new tournament " + str(tournament_id))
				if (tournament_id):
					await self.send(text_data=json.dumps({'type': 'joined_tournament', 'id': tournament_id}))
				else:
					await self.send(text_data=json.dumps({'type': 'error_tournament'}))
				return
			elif (text_data_json["type"] == "join_tournament"):
				if (self.user == AnonymousUser()):
					raise Exception("Not logged in")
				if (await get_tournament(self.user) != 0):
					raise Exception("Already in tournament")
				# tournament = await get_tournament(self.user)
				# if (tournament != 0):
				# 	await tournament_manager.quit_tournament(tournament, self.user)
				jsonschema.validate(text_data_json, schema_join_tournament)
				id = await tournament_manager.join_tournament(text_data_json["id"], self, text_data_json["password"])
				if id >= 0:
					await self.send(text_data=json.dumps({'type': 'joined_tournament', 'id': id}))
				else:
					await self.send(text_data=json.dumps({'type': 'error_tournament'}))
				if (id > 0):
					loop = asyncio.get_running_loop()
					loop.create_task(
						tournament_manager.start_tournament(id)
					)
				return
			elif (text_data_json["type"] == "is_in_tournament"):
				answer = True
				if (await get_tournament(self.user) == 0):
					answer = False
				await self.send(text_data=json.dumps({'type': 'is_in_tournament', 'message':answer}))
			elif (text_data_json["type"] == "quit_tournament"):
				tournament = await get_tournament(self.user)
				if (tournament == 0):
					raise Exception("Not in tournament")
				await tournament_manager.quit_tournament(tournament, self.user, self)
				await self.send(text_data=json.dumps({'type': 'quit_tournament'}))
				return
			# Partie Jeu
			elif (text_data_json["type"] == "game"):
				jsonschema.validate(text_data_json, schema_game)
				buffer = text_data_json["buffer"]
				await self.channel_layer.group_send(
					self.server_group, {"type": "game.server", "buffer": json.dumps(buffer), "sender" : self.id}
				)
			#aucousin
			elif text_data_json.get('type') == 'login':
				print ("=========", (await self.get_user_id(text_data_json)).username,"==============")
				jsonschema.validate(text_data_json, schema_login)
				self.user = await self.get_user_id(text_data_json)
				if (self.user == AnonymousUser()):
					#await self.disconnect(0)
					return
				answer = True
				if (await get_tournament(self.user) == 0):
					answer = False
				await self.send(text_data=json.dumps({'type': 'is_in_tournament', 'message':answer}))
				await set_status(self.user, True)
			elif text_data_json.get('type') == 'logout':
				if self.user != AnonymousUser():
					await set_status(self.user, False)
				self.user = AnonymousUser()
				if (self.in_tournament):
					await self.send(text_data=json.dumps({"type": "error", "message": "Don't logout mid game/tournament ... cheater"}))
					await self.close()
			#ANCHOR - Tournament updates
			elif text_data_json['type'] == 'join_tournament_updates':
				await self.channel_layer.group_add("tournament_updates", self.channel_name)
			elif text_data_json['type'] == 'leave_tournament_updates':
				await self.channel_layer.group_discard("tournament_updates", self.channel_name)
			elif text_data_json['type'] == 'request_tournament_list':
				await self.broadcast_tournament_update()
			# elif text_data_json['type'] == 'tournament.update':
			# 	await self.tournament_update(text_data_json)
			# elif text_data_json['type'] == 'delete_tournaments':
			# 	await delete_tournament_data()
			# 	await self.send(text_data=json.dumps({'type': 'success_message', 'msg': 'Tournaments deleted.'}))

			else:
				raise Exception("Bad type")
		except Exception as e:
			print("Error : " + str(e))
			await self.send(text_data=json.dumps({"type": "error", "message": str(e)}))

	@database_sync_to_async
	def get_user_id(self, data):
		# user = get_user_model().objects.get(id=validated_token["user_id"])
		# return (user)
		if (not data.get('jwtToken')):
			return (AnonymousUser())
		payload = jwt.decode(data.get('jwtToken'), key=str(settings.SECRET_KEY), algorithms=['HS256'])
		user_id = payload.get('user_id')
		if (not user_id): #check if token contain a user_id
			return(AnonymousUser())
		try:
			user = UserModel.objects.get(id=user_id)
			return user
		except UserModel.DoesNotExist:
			return (AnonymousUser())

	async def tournament_update(self, event):
		await self.send(text_data=json.dumps({"type": "tournament_update", "message": event["data"]}))

	async def game_server(self, event):
		global trigger
		update = False
		sender = event["sender"]
		# print ("Event : ", event)
		# if (image < self.data.image or image > int(round((t.time() -  float(self.beginTime) / 1000) * ctx.fps))):
		# 	return            
		buffer = json.loads(event["buffer"])
		for elem in buffer:
			image = elem["image"]
			keys = elem["keys"]
			# if not (image < self.data.image):            
			# 	self.buffer[sender].append({"keys" : keys, "image" : image})
			if not (image < self.data.image or image > int(round((t.time() -  float(self.beginTime) / 1000) * ctx.fps))):  
				if (len(self.buffer[sender]) and self.buffer[sender][-1]["image"] > image):
					print ("self.image : ", self.data.image, " image : ", image)
				self.buffer[sender].append({"keys" : keys, "image" : image})
				if (len(self.buffer[0]) > ctx.lag_delay * ctx.fps and len(self.buffer[1]) == 0):
					self.buffer[1].append({"keys" : [self.data.keys[2], self.data.keys[3]], "image" : self.buffer[0][0]["image"]})
				if (len(self.buffer[1]) > ctx.lag_delay * ctx.fps and len(self.buffer[0]) == 0):
					self.buffer[0].append({"keys" : [self.data.keys[0], self.data.keys[1]], "image" : self.buffer[1][0]["image"]})
		#print("sender :", sender)
		while (len(self.buffer[0]) != 0 and len(self.buffer[1]) != 0):
			# if (trigger):
			# 	print("len(Buffer[0]) : ", len(self.buffer[0]), " || len(Buffer[1]) : ", len(self.buffer[1]))
			# 	print("Buffer[0] : ", self.buffer[0], " || Buffer[1] : ", self.buffer[1])
			# 	print ("image : ", self.data.image, " by ", self.room_group_name)
			# print (type(self.data.image), type(self.buffer[0][0]["image"]))

			if (self.buffer[0][0]["image"] < self.data.image or self.buffer[1][0]["image"] < self.data.image):
				trigger = False

			while (len(self.buffer[0]) != 0 and self.buffer[0][0]["image"] <= self.data.image):
				self.data.keys[0] = self.buffer[0][0]["keys"][0]
				self.data.keys[1] = self.buffer[0][0]["keys"][1]
				self.buffer[0].pop(0)
			while (len(self.buffer[1]) != 0 and self.buffer[1][0]["image"] <= self.data.image):
				self.data.keys[2] = self.buffer[1][0]["keys"][0]
				self.data.keys[3] = self.buffer[1][0]["keys"][1]
				self.buffer[1].pop(0)

			self.data.image += 1

			# if (self.buffer[0][0]["image"] <= self.buffer[1][0]["image"]):
			# 	self.data.keys[0] = self.buffer[0][0]["keys"][0]
			# 	self.data.keys[1] = self.buffer[0][0]["keys"][1]
			# 	self.data.image = self.buffer[0][0]["image"]
			# if (self.buffer[1][0]["image"] <= self.buffer[0][0]["image"]):
			# 	self.data.keys[2] = self.buffer[1][0]["keys"][0]
			# 	self.data.keys[3] = self.buffer[1][0]["keys"][1]
			# 	self.data.image = self.buffer[1][0]["image"]
			# if (self.buffer[0][0]["image"] == self.buffer[1][0]["image"]):
			# 	self.buffer[0].pop(0)
			# 	self.buffer[1].pop(0)
			# elif (self.buffer[0][0]["image"] < self.buffer[1][0]["image"]):
			# 	self.buffer[0].pop(0)
			# elif (self.buffer[1][0]["image"] < self.buffer[0][0]["image"]):
			# 	self.buffer[1].pop(0)

			#data.keys = json.loads(event["keys"])
			simulate(self.data, ctx)
			update = True
		#Send message to room group
		if (update):
			await self.channel_layer.group_send(
				self.room_group_name, {"type": "game.message", "message": json.dumps(dataToJson(self.data))}
			)
			await self.channel_layer.group_send(
				self.groupname_adversaire, {"type": "game.message", "message": json.dumps(dataToJson(self.data))}
			)
	# Receive message from room group
	async def game_message(self, event):
		message = event["message"]
		await self.send(text_data=json.dumps({"type" : "game_data", "data" : message}))

	async def reset_game(self, time):
		print("reset " + self.room_group_name)
		self.data = data_class()
		self.buffer = [[],[]]
		self.time = time

	async def join_tournament_updates(self):
		await self.channel_layer.group_add(
			"tournament_updates",
			self.channel_name
    	)
	
	async def broadcast_tournament_update(self):
		tournaments = tournament_manager.tournament_json()
		channel_layer = get_channel_layer()
		await self.send(json.dumps
			({
				"type": "tournament_update",
				"message": tournaments
			})
		)
		# await channel_layer.group_send(
		# 	"tournament_updates",
		# 	{
		# 		"type": "tournament.update",
		# 		"data": tournaments
		# 	}
		# )

	# async def tournament_update(self, event):
	# 	tournaments = event['data']
	# 	await self.send(text_data=json.dumps({
	# 		'type': 'send_update_tournaments',
	# 		'message': tournaments
	# 	}))
	async def tournament_message(self, event):
		message = event['message']

		await self.send(text_data=json.dumps({
			'type': 'tournament_update',
			'message': message
		}))

@database_sync_to_async
def set_status(user, status):
	print(user.userprofile.tfa_enabled)
	user = UserModel.objects.get(id=user.id)
	user.userprofile.status = status
	user.userprofile.save()
	user.save()
	print(user.userprofile.tfa_enabled)

@database_sync_to_async
def get_status(user):
	user = UserModel.objects.get(id=user.id)
	return user.userprofile.status

@database_sync_to_async
def get_tournament(user):
	user = UserModel.objects.get(id=user.id)
	if (user == AnonymousUser()):
		print(0)
		return 0
	return user.userprofile.tournament

@database_sync_to_async
def get_id(user):
	return user.id

# @database_sync_to_async
# def delete_tournament_data():
#     try:
#         deleted_tournaments_count, _ = Tournament.objects.all().delete()
#         print(f"{deleted_tournaments_count} tournaments deleted.")
#     except Exception as e:
#         print(f"An error occurred while deleting tournament data: {str(e)}")