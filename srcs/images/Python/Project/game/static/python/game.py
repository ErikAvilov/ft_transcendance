import math

PI = math.pi
class Transition:
	def __init__(self):
		self.dt = 0
		self.nrv = 0
		self.ntv = 0
		self.nlvy = 0
		self.nrvy = 0
		self.restart = False

class Ball:
	def __init__(self):
		self.x = 0
		self.y = 0
		self.rv = 0
		self.tv = 0
		self.r = 0 

class Paddle:
	def __init__(self):
		self.x = 0
		self.y = 0
		self.vy = 0
		self.recover = 0
		self.score = 0

def edgesColl(data, ctx, tr):
	if data.ball.x + ballvx(data.ball) * tr.dt < data.ball.r - ctx.width / 2 - ctx.lengoal:
		tr.ntv = PI
		tr.nrv = ctx.ballv
		tr.restart = True
		tr.dt = (data.ball.r - ctx.width / 2 - ctx.lengoal - data.ball.x) / ballvx(data.ball)

	if data.ball.x + ballvx(data.ball) * tr.dt > ctx.width / 2 - data.ball.r + ctx.lengoal:
		tr.ntv = 0
		tr.nrv = ctx.ballv
		tr.restart = True
		tr.dt = (ctx.width / 2 - data.ball.r  + ctx.lengoal - data.ball.x) / ballvx(data.ball)

	if data.ball.y + ballvy(data.ball) * tr.dt < data.ball.r - ctx.height / 2 and math.sin(data.ball.tv) < 0:
		tr.ntv = sanangle(- data.ball.tv)
		tr.dt = (data.ball.r - ctx.height / 2 - data.ball.y) / ballvy(data.ball)

	if data.ball.y + ballvy(data.ball) * tr.dt > ctx.height / 2 - data.ball.r and math.sin(data.ball.tv) > 0:
		tr.ntv = sanangle(- data.ball.tv)
		tr.dt = (ctx.height / 2 - data.ball.r - data.ball.y) / ballvy(data.ball)

	return tr

def paddlesColl(data, ctx, tr):
	paddle = None
	side = 0
	dtc = 0

	for i in range(4):

		if i == 0:
			side = 1
			paddle = data.paddleL
			dtc = (data.paddleL.x + ctx.paddlew - data.ball.x + data.ball.r) / ballvx(data.ball)
		elif i == 1:
			side = -1
			dtc = (data.paddleL.x - data.ball.x - data.ball.r) / ballvx(data.ball)
		elif i == 2:
			side = 1
			paddle = data.paddleR
			dtc = (data.paddleR.x + ctx.paddlew - data.ball.x + data.ball.r) / ballvx(data.ball)
		elif i == 3:
			side = -1
			dtc = (data.paddleR.x - data.ball.x - data.ball.r) / ballvx(data.ball)

		if 0 <= dtc <= tr.dt and data.ball.y + ballvy(data.ball) * dtc > paddle.y + paddle.vy * dtc and \
				data.ball.y + ballvy(data.ball) * dtc < paddle.y + paddle.vy * dtc + ctx.paddleh and \
				math.cos(data.ball.tv) * side < 0:
			tr.rv = data.ball.rv / ctx.ballfriction
			tr.dt = dtc
			tr.ntv = sanangle(((2 * (data.ball.y + ballvy(data.ball) * dtc - (paddle.y + dtc * paddle.vy)) / ctx.paddleh) - 1) * PI / 4)
			if side == -1:
				tr.ntv = sanangle(PI - tr.ntv)

	return tr

def spheres(sphere1, sphere2):
	dx = sphere1.x - sphere2.x
	dy = sphere1.y - sphere2.y
	dvx = ballvx(sphere1) - ballvx(sphere2)
	dvy = ballvy(sphere1) - ballvy(sphere2)

	a = dvx ** 2 + dvy ** 2
	if a == 0:
		return -1
	b = 2 * (dx * dvx + dy * dvy)
	c = dx ** 2 + dy ** 2 - (sphere1.r + sphere2.r) ** 2

	delta = b ** 2 - 4 * a * c

	if delta < 0:
		return -1
	return (-b - math.sqrt(delta)) / (2 * a)

def allSpheresColl(data, ctx, tr):
	little = Paddle()
	little.x = data.paddleL.x + ctx.paddlew / 2
	little.y = data.paddleL.y
	little.r = ctx.paddlew / 2
	little.rv = data.paddleL.vy
	little.tv = PI / 2

	coll = spheres(little, data.ball)
	if 0 <= coll <= tr.dt:
		tr.nrv *= ctx.smash
		tr.dt = coll
		tr.ntv = sanangle(-PI / 4)
		tr.nlvy = ctx.recoil
		data.paddleL.recover = 0

	little.y = data.paddleL.y + ctx.paddleh

	coll = spheres(little, data.ball)
	if 0 <= coll <= tr.dt:
		tr.nrv *= ctx.smash
		tr.dt = coll
		tr.ntv = sanangle(PI / 4)
		tr.nlvy = -ctx.recoil
		data.paddleL.recover = 0

	little.x = data.paddleR.x + ctx.paddlew / 2
	little.y = data.paddleR.y
	little.rv = data.paddleR.vy

	coll = spheres(little, data.ball)
	if 0 <= coll <= tr.dt:
		tr.nrv *= ctx.smash
		tr.dt = coll
		tr.ntv = sanangle(-3 * PI / 4)
		tr.nrvy = ctx.recoil
		data.paddleR.recover = 0

	little.y = data.paddleR.y + ctx.paddleh

	coll = spheres(little, data.ball)
	if 0 <= coll <= tr.dt:
		tr.nrv *= ctx.smash
		tr.dt = coll
		tr.ntv = sanangle(3 * PI / 4)
		tr.nrvy = -ctx.recoil
		data.paddleR.recover = 0

	return tr

def paddles(data, ctx, tr):
	if data.paddleL.y + data.paddleL.vy * tr.dt - ctx.paddlew / 2 < -ctx.height / 2:
		tr.dt = (-ctx.height / 2 - data.paddleL.y + ctx.paddlew / 2) / data.paddleL.vy
		tr.nlvy = 0
	elif data.paddleL.y + data.paddleL.vy * tr.dt + ctx.paddleh + ctx.paddlew / 2 > ctx.height / 2:
		tr.dt = (ctx.height / 2 - data.paddleL.y - ctx.paddlew / 2 - ctx.paddleh) / data.paddleL.vy
		tr.nlvy = 0

	if data.paddleR.y + data.paddleR.vy * tr.dt - ctx.paddlew / 2 < -ctx.height / 2:
		tr.dt = (-ctx.height / 2 - data.paddleR.y + ctx.paddlew / 2) / data.paddleR.vy
		tr.nrvy = 0
	elif data.paddleR.y + data.paddleR.vy * tr.dt + ctx.paddleh + ctx.paddlew / 2 > ctx.height / 2:
		tr.dt = (ctx.height / 2 - data.paddleR.y - ctx.paddlew / 2 - ctx.paddleh) / data.paddleR.vy
		tr.nrvy = 0

	return tr

def input(data, ctx):
	data.paddleL.vy /= ctx.paddlefriction
	data.paddleR.vy /= ctx.paddlefriction
	data.ball.rv /= ctx.ballfriction
	if data.ball.rv < ctx.ballv:
		data.ball.rv = ctx.ballv
	data.paddleL.recover += data.t / ctx.recovertime
	data.paddleR.recover += data.t / ctx.recovertime
	if data.paddleL.recover > 1:
		data.paddleL.recover = 1
	if data.paddleR.recover > 1:
		data.paddleR.recover = 1
	if data.keys[0]:
		data.paddleL.vy += ctx.paddlespeed * data.paddleL.recover * data.t
	if data.keys[1]:
		data.paddleL.vy -= ctx.paddlespeed * data.paddleL.recover * data.t
	if data.keys[2]:
		data.paddleR.vy += ctx.paddlespeed * data.paddleR.recover * data.t
	if data.keys[3]:
		data.paddleR.vy -= ctx.paddlespeed * data.paddleR.recover * data.t

def sanangle(angle):
	return angle % (2 * PI)

def ballvx(ball):
	return ball.rv * math.cos(ball.tv)

def ballvy(ball):
	return ball.rv * math.sin(ball.tv)

def deepcopy(tr):
	copy = Transition()
	copy.dt = tr.dt
	copy.nrv = tr.nrv
	copy.ntv = tr.ntv
	copy.nlvy = tr.nlvy
	copy.nrvy = tr.nrvy
	copy.restart = tr.restart
	return copy

def simulate(data, ctx):
	input(data, ctx)
	i = 0
	final = Transition()
	while data.t > 0:
		tr = Transition()
		tr.dt = data.t
		tr.nrv = data.ball.rv
		tr.ntv = data.ball.tv
		tr.nlvy = data.paddleL.vy
		tr.nrvy = data.paddleR.vy
		tr.restart = False
		final = deepcopy(tr)

		inter = paddles(data, ctx, deepcopy(tr))
		tr.dt = inter.dt
		if inter.dt < final.dt:
			final = deepcopy(inter)

		if not data.scored:
			inter = edgesColl(data, ctx, deepcopy(tr))
			tr.dt = inter.dt
			if inter.dt < final.dt:
				final = deepcopy(inter)

		inter = paddlesColl(data, ctx, deepcopy(tr))
		tr.dt = inter.dt
		if inter.dt < final.dt:
			final = deepcopy(inter)

		inter = allSpheresColl(data, ctx, deepcopy(tr))
		tr.dt = inter.dt
		if inter.dt < final.dt:
			final = deepcopy(inter)

		data.ball.x += ballvx(data.ball) * final.dt
		data.ball.y += ballvy(data.ball) * final.dt

		if final.restart and not data.scored:
			if data.ball.x > 0:
				data.paddleL.score += 1
			else:
				data.paddleR.score += 1
			data.scored = True

		data.paddleL.y += data.paddleL.vy * final.dt
		data.paddleR.y += data.paddleR.vy * final.dt

		data.ball.rv = final.nrv
		data.ball.tv = final.ntv
		if data.ball.rv > 1000000:
			data.ball.rv = 1000000

		data.paddleL.vy = final.nlvy
		data.paddleR.vy = final.nrvy
		data.t -= final.dt

		i += 1
		if i == 10000:
			return 1

	data.t = 0.1
	if data.scored:
		data.timeSinceRestart += data.t
	if data.timeSinceRestart >= ctx.timeToRestart:
		data.ball.x = 0
		data.ball.y = 0
		data.timeSinceRestart = 0
		data.scored = False

	return 0
