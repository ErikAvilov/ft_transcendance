import random as r
import time as t
import json
import asyncio
from game.static.python.ext import ctx
from accounts.models import Game
from channels.db import database_sync_to_async
from accounts.models import UserModel

class tournament_manager:
	dict = {}
	last_vs = -1
	passwords = {}

	def __init__(self):
		return

	@staticmethod
	def tournament_json():
		updatejson = []
		for key, value in tournament_manager.dict.items():
			if (tournament_manager.passwords[key] != None and value.current != value.nb_player):
				updatejson.append({"id":key, "host":str(value.users[0]), "completion":(""+str(value.current)+"/"+str(value.nb_player))})
		return updatejson

	@staticmethod
	def new_tournament(size, password):
#debug log
		print('create tournament of size ' + str(size))
		if size <= 1 or (size & (size - 1)):
			raise Exception('please provide a power of 2 greater than 1')
		key = r.randrange(100000, 999999)
#		 if (1):#test
#			 key = 7
#			 if key in tournament_manager.dict:
#				 tournament_manager.dict.pop(key)
		while key in tournament_manager.dict:
			key = r.randrange(100000, 999999)
#debug log
		tournament_manager.dict[key] = tournament(size, key)
		tournament_manager.passwords[key] = password
		return key

	@staticmethod
	async def quit_tournament(id, player, socket):
		if id in tournament_manager.dict:
			await tournament_manager.dict[id].quit(player)
			updatejson = tournament_manager.tournament_json()
			await socket.channel_layer.group_send(
				"tournament_updates", {"type": "tournament.update", "data": updatejson}
			)
		else:
			await set_tournament(player, 0)

	@staticmethod
	async def join_tournament(id, player, password):
#debug log
		print(f"Trying to join tournament: {id}")
		if (id == -1):
#debug log  
			password = None
			print("id is -1")
			if (tournament_manager.last_vs != -1 and (tournament_manager.last_vs in tournament_manager.dict)):
				id = tournament_manager.last_vs
				tournament_manager.last_vs = -1
			else :
				tournament_manager.last_vs = tournament_manager.new_tournament(2, None)
				id = tournament_manager.last_vs
		if id in tournament_manager.dict:
#debug log
			print(f"Submitted password: {password}")
			expected_password = tournament_manager.passwords[id]
#debug log
			print(f"Expected password: {expected_password}")

			if expected_password == password:
				ret = await tournament_manager.dict[id].add_player(player)
				updatejson = tournament_manager.tournament_json()
				await player.channel_layer.group_send(
				   	"tournament_updates", {"type": "tournament.update", "data": updatejson}
				)
				return ret
			else:
				raise Exception("Incorrect password")
		else:
			raise Exception("Tournament ID does not exist")

	@staticmethod
	async def start_tournament(id):
		if id in tournament_manager.dict:
			await tournament_manager.dict[id].start()
		else:
			raise Exception("Tournament ID does not exist")

class tournament:
	def __init__(self, size, id):
		if (size <= 1 or (size & (size - 1))):
			raise Exception('please provide a power of 2 greater than 1')
		self.nb_player = size
		self.tournament_id = id
		self.current = 0
		self.sockets = [None] * size
		self.users = [None] * size

	async def add_player(self, player):
		if (self.current == self.nb_player):
			raise Exception('tournament is full')
#debug log
		print("add player " + str(self.current))
		await set_tournament(player.user, self.tournament_id)
		player.in_tournament = self.tournament_id
		self.sockets[self.current] = player
		self.users[self.current] = player.user
		self.current = self.current + 1
		if (self.current == self.nb_player):
#debug log
			print('start tournament')
			return self.tournament_id
		return 0

	async def quit(self, player):
		if (self.current != self.nb_player):
			self.current -= 1
			socket = None
			if (self.current == 0):
				socket = self.users[0]
				tournament_manager.dict.pop(self.tournament_id)
			else:
				i = 0
				while (self.users[i] != player):
					i += 1
				socket = self.users[i]
				self.sockets[i] = self.sockets[self.current]
				self.users[i] = self.users[self.current]
			socket.in_tournament = 0
			await set_tournament(player, 0)

	async def start(self):
#debug log
		print("---init---")
		n = self.nb_player
		for i in range(n):
			self.sockets[i].room_name = "RT" + str(self.tournament_id) + "P" + str(i)
			self.sockets[i].room_group_name = "T" + str(self.tournament_id) + "P" + str(i)
			await self.sockets[i].channel_layer.group_add(self.sockets[i].room_group_name, self.sockets[i].channel_name)
		while (n > 1):
#debug log
			print("---new round---")
			n = int(n/2)
			j = 0
			while (j < self.nb_player):
				for i in range(n):
#debug log
					print('start match ' + str(j + i) + ' vs ' + str(j + i + n))
					self.sockets[j+i].groupname_adversaire = self.sockets[j+i+n].room_group_name
					self.sockets[j+i+n].groupname_adversaire = self.sockets[j+i].room_group_name
					self.sockets[j+i].server_group = self.sockets[j+i].room_group_name
					self.sockets[j+i+n].server_group = self.sockets[j+i].room_group_name
					self.sockets[j+i].id = 0
					self.sockets[j+i+n].id = 1
					time = int(round(t.time() * 1000))
					self.sockets[j+i].beginTime = time
					self.sockets[j+i+n].beginTime = time
					await self.sockets[j+i].reset_game(time)
					await self.sockets[j+i+n].reset_game(time)
					pee1 = await	return_name(self.users[j+i])
					pee2 = await	return_name(self.users[j+i+n])
					if (self.sockets[j+i].connected == 1):
						await self.sockets[j+i].send(text_data=json.dumps({"type" : "initialize", "time" : time, "id" : self.sockets[j+i].id, "p1" : pee1, "p2" : pee2 }))
					if (self.sockets[j+i+n].connected == 1):
						await self.sockets[j+i+n].send(text_data=json.dumps({"type" : "initialize", "time" : time, "id" : self.sockets[j+i+n].id, "p1" : pee1, "p2" : pee2}))

				j += 2 * n
			await asyncio.sleep(ctx.gameDuration)
			j = 0
			while (j < self.nb_player):
				for i in range(n):
					p1 = self.sockets[j+i].data.paddleL.score
					p2 = self.sockets[j+i].data.paddleR.score
					
					game = None
					if (self.sockets[j+i].connected == 1):
						await self.sockets[j+i].send(text_data=json.dumps({"type" : "stop", }))
					else:
						p1 = -1
					if (self.sockets[j+i+n].connected == 1):
						await self.sockets[j+i+n].send(text_data=json.dumps({"type" : "stop"}))
					else:
						p2 = -1
					if (p2 > p1):
#debug log
						print(str(j+i+n) + " beat " + str(j+i))
						game = Game(name="T"+str(self.tournament_id), player1=self.users[j+i], player2=self.users[j+i+n],
							winner=self.users[j+i+n], loser=self.users[j+i], winnerscore=p2, loserscore = p1)
						tmp = self.sockets[j+i]
						self.sockets[j+i] = self.sockets[j+i+n]
						self.sockets[j+i+n] = tmp
						tmp = self.users[j+i]
						self.users[j+i] = self.users[j+i+n]
						self.users[j+i+n] = tmp
					else:
#debug log
						print(str(j+i) + " beat " + str(j+i+n))
						game = Game(name="T"+str(self.tournament_id), player1=self.users[j+i], player2=self.users[j+i+n],
							winner=self.users[j+i], loser=self.users[j+i+n], winnerscore=p1, loserscore = p2)
					await save_game(game)
				j += 2 * n
			await asyncio.sleep(3)
		tab = []
		#for index, user in enumerate(self.users):
		for i in range(self.nb_player):
			username = await return_name(self.users[i])
			tab.append({"username" : username, "rank" : i + 1})
		for i in range(self.nb_player):
			if (self.sockets[i].connected == 1):
				await self.sockets[i].send(text_data=json.dumps({"type" : "rank", "rank" : i+1, "list": tab}))
			self.sockets[i].in_tournament = 0
			await set_tournament(self.users[i], 0)
		tournament_manager.dict.pop(self.tournament_id)


@database_sync_to_async
def return_name(user):
	user = UserModel.objects.get(id=user.id)
	return user.userprofile.name

@database_sync_to_async
def save_game(game):
	game.save()

@database_sync_to_async
def set_tournament(user, id):
	user = UserModel.objects.get(id=user.id)
	user.userprofile.tournament = id
	user.userprofile.save()
	user.save()