
class ctx_class(object):
    def __init__(self):
        self.width = 1000
        self.height = 600
        self.paddleh = 150
        self.paddlew = 25
        self.paddled = 20
        self.paddlespeed = 250
        self.ballv = 50
        self.ballr = 25
        self.recoil = 150
        self.paddlefriction = 1.1
        self.ballfriction = 1.0002
        self.smash = 1.4
        self.recovertime = 2
        self.lengoal = 200
        self.duo = "false"
        self.timeToRestart = 5
        self.fps = 60
        self.fpi = 3
        self.gameDuration = 25
        self.lag_delay = 2
        self.difficulty = 5000

ctx = ctx_class()