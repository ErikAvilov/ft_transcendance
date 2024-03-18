import random
import json
from django.db import models
from django.conf import settings
import time as t

class Tournament(models.Model):
    tournament_id = models.CharField(max_length=12, unique=True, null=True, editable=False)
    size = models.IntegerField()
    password = models.CharField(max_length=50)
    host_player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hosted_tournaments', default=None)
    players = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tournaments')
    STATUS_CHOICES = (
        ('active', 'active'),
        ('completed', 'completed'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    def save(self, *args, **kwargs):
        if not self.tournament_id:
            self.tournament_id = str(random.randint(100000, 999999))
            while Tournament.objects.filter(tournament_id=self.tournament_id).exists():
                self.tournament_id = str(random.randint(100000, 999999))
        
        super(Tournament, self).save(*args, **kwargs)

    @staticmethod
    def create_tournament(size, password, host_player):
        if Tournament.objects.filter(host_player=host_player, status='active').exists():
            raise Exception("Host already has an active tournament.", Tournament.objects.get(host_player=host_player, status='active').tournament_id)
        tournament = Tournament(size=size, password=password, host_player=host_player)
        tournament.save()
        tournament.add_player(host_player)
#        tournament.players.add(host_player)
        return tournament

    def add_player(self, player):
        if Tournament.objects.filter(players=player, status='active').exists():
            return False
        if self.players.filter(id=player.id).exists():
            return False
		
        if self.players.count() < self.size:
            self.players.add(player)
            self.save()
            return True
        

        return False
    
    def start(self):
        n = self.players.count()
        for i in range(n):
            self.sockets[i].room_group_name = "T" + self.tournament_id + "P" + i
        while (n > 1):
            n = int(n/2)
            j = 0
            while (j < self.players.count):
                for i in range(n):
#                    print('start match ' + str(self.player[j + i]) + ' vs ' + str(self.player[j + i + n]))
                    self.sockets[j+i].groupname_adversaire = self.sockets[j+i+n].room_group_name
                    self.sockets[j+i+n].groupname_adversaire = self.sockets[j+i].room_group_name
                    self.sockets[j+i].server_group = self.sockets[j+i].room_group_name
                    self.sockets[j+i+n].server_group = self.sockets[j+i].room_group_name
                    self.sockets[j+i].id = 0
                    self.sockets[j+i+n].id = 1
                    time = int(round(t.time() * 1000))
                    self.sockets[j+i].send(text_data=json.dumps({"type" : "initialize", "time" : time, "id" : self.sockets[j+i].id}))
                    self.sockets[j+i+n].send(text_data=json.dumps({"type" : "initialize", "time" : time, "id" : self.sockets[j+i+n].id}))
                j += 2 * n
            j = 0
            while (j < self.players.count):
                for i in range(n):
                    if (not(winner(self.player[i]))):
                        tmp = self.sockets[i]
                        self.sockets[i] = self.sockets[i + n]
                        self.sockets[i + n] = tmp
                j += 2 * n
#        print('winner : ' + str(self.player[0]))
    
class TournamentResult(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	score = models.IntegerField()
	date = models.DateTimeField(auto_now_add=True)