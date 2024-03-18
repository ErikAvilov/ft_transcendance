/* ======================================================================================================
# SECTION: VARS 
======================================================================================================== */
import { simulate } from "./game.js";
import { getCookie, check_token } from "./jwt.js";

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const gameManagement = document.getElementById('gameManagement');
const homeButton = document.getElementById('homeButton');
const playButton = document.getElementById('playButton');
const pauseOverlay = document.getElementById('pauseOverlay');
const p1Display = document.getElementById('player1Name');
const p2Display = document.getElementById('player2Name');

//ingame
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', restart);

var tbody = document.getElementById('Ranking').getElementsByTagName('tbody')[0];
var ranking = document.getElementById('Ranking');
let gameRunning = false;
let gameAnimationFrame;
let isColorChangeEnabled = true;
let isControlSettings = false;
let upKey1 = 'w';
let downKey1 = 's';
let upKey2 = 'o';
let downKey2 = 'l';
let ia1 = false;
let ia2 = false;
let keyDownHandler;
let PI = Math.PI;

const gameConfigElement = document.getElementById('gameConfig');

// let width = parseFloat(gameConfigElement.getAttribute('data-width'));
// let height = parseFloat(gameConfigElement.getAttribute('data-height'));
// let paddleh = parseFloat(gameConfigElement.getAttribute('data-paddleh'));
// let paddlew = parseFloat(gameConfigElement.getAttribute('data-paddlew'));
// let paddled = parseFloat(gameConfigElement.getAttribute('data-paddled'));
// let paddlespeed = parseFloat(gameConfigElement.getAttribute('data-paddlespeed'));
// let recoil = parseFloat(gameConfigElement.getAttribute('data-recoil'));
// let paddlefriction = parseFloat(gameConfigElement.getAttribute('data-paddlefriction'));
// let ballfriction = parseFloat(gameConfigElement.getAttribute('data-ballfriction'));
// let smash = parseFloat(gameConfigElement.getAttribute('data-smash'));
// let recovertime = parseFloat(gameConfigElement.getAttribute('data-recovertime'));
// let ballv = parseFloat(gameConfigElement.getAttribute('data-ballv'));
// let lengoal = parseFloat(gameConfigElement.getAttribute('data-lengoal'));

function new_data() {
    let new_elem =
    {
        t: 0.1,
        keys: [false, false, false, false],
        ball:
        {
            x: 0,
            y: 0,
            r: ctx.ballr,
            rv: ctx.ballv,
            tv: PI,
        },
        paddleR:
        {
            x: ctx.width / 2 - ctx.paddled - ctx.paddlew,
            y: - ctx.paddleh / 2,
            vy: 0,
            recover: 1,
            score: 0
        },
        paddleL:
        {
            x: ctx.paddled - ctx.width / 2,
            y: - ctx.paddleh / 2,
            vy: 0,
            recover: 1,
            score: 0
        },
        scored: false,
        timeSinceRestart: 0,
        image: 0
    };
    return new_elem;
}


let data = new_data();
let beginTime = 0;
let timer = 0;
let liste = []
let id = 2;

function reset_game() {
    p1Display.innerHTML = '';
    p2Display.innerHTML = '';
    data = new_data();
    beginTime = 0;
    timer = 0;
    liste = []
    id = 2;
    closeTimeBar();
}

/* ======================================================================================================
# SECTION: PAUSE/START 
======================================================================================================== */
const pauseSettings = document.getElementById('pauseSettings');


function startGame() {
    if (!gameRunning) {
        if (beginTime == 0)
            beginTime = new Date().getTime();
        gameRunning = true;
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        restartButton.style.display = 'none';
        gameManagement.style.display = 'none';
        homeButton.style.display = 'none';
        pauseOverlay.style.display = 'none';
        exitControlSettingsMode('upControlP1');
        exitControlSettingsMode('downControlP1');
        exitControlSettingsMode('upControlP2');
        exitControlSettingsMode('downControlP2');
    }
}

function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        updatePauseOverlay();
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
        gameManagement.style.display = 'block';
        homeButton.style.display = 'block';
        restartButton.style.display = 'block';
        pauseOverlay.style.display = 'block';
        cancelAnimationFrame(gameAnimationFrame);
    }
}

function restart() {
    if (!gameRunning)
        reset_game();
}



window.addEventListener('resize', updatePauseOverlay);
function updatePauseOverlay() {
    const rect = gameContainer.getBoundingClientRect();
    pauseOverlay.style.width = `${rect.width}px`;
    pauseOverlay.style.height = `${rect.height}px`;
    pauseOverlay.style.top = `0px`;
    pauseOverlay.style.left = `0px`;
}

/* ======================================================================================================
# SECTION: SCORE JS 
======================================================================================================== */


function animateScore(scoreElement) {
    scoreElement.classList.remove('score-animate');
    void scoreElement.offsetWidth;
    scoreElement.classList.add('score-animate');
    setTimeout(() => {
        scoreElement.classList.remove('score-animate');
    }, 500);
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('upControlP1').addEventListener('click', function () {
        enterControlSettingsMode('upControlP1');
    });

    document.getElementById('downControlP1').addEventListener('click', function () {
        enterControlSettingsMode('downControlP1');
    });

    document.getElementById('upControlP2').addEventListener('click', function () {
        enterControlSettingsMode('upControlP2');
    });

    document.getElementById('downControlP2').addEventListener('click', function () {
        enterControlSettingsMode('downControlP2');
    });
});

function enterControlSettingsMode(control) {
    if (isControlSettings) {
        return;
    }
    isControlSettings = true;
    document.getElementById(control).classList.add('active');
    waitForNextKeyPress(control);
}

function waitForNextKeyPress(control) {
    keyDownHandler = function (e) {
        if (!e.repeat) {
            updateControl(control, e.key);
            exitControlSettingsMode(control);
        }
    };
    document.addEventListener('keydown', keyDownHandler);
}

function updateControl(control, key) {
    switch (control) {
        case 'upControlP1':
            upKey1 = key;
            document.getElementById(control).textContent = "P1 Up: " + key;
            break;
        case 'downControlP1':
            downKey1 = key;
            document.getElementById(control).textContent = "P1 Down: " + key;
            break;
        case 'upControlP2':
            upKey2 = key;
            document.getElementById(control).textContent = "P2 Up: " + key;
            break;
        case 'downControlP2':
            downKey2 = key;
            document.getElementById(control).textContent = "P2 Down:  " + key;
            break;
    }
}

function exitControlSettingsMode(control) {
    document.removeEventListener('keydown', keyDownHandler);
    document.getElementById(control).classList.remove('active');
    isControlSettings = false;
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleColorChangeCheckbox = document.getElementById('toggleColorChange');
    
    toggleColorChangeCheckbox.addEventListener('change', function () {
        isColorChangeEnabled = this.checked;
    });
    
    document.getElementById('toggleIA1').addEventListener('change', function () {
        ia1 = this.checked;
    });
    
    document.getElementById('toggleIA2').addEventListener('change', function () {
        ia2 = this.checked;
    });
});
var gameSocket = null;
import { updateTournamentListWithData } from "./tournament.js";

function handleScore()
{
	if (p2Score.textContent != data.paddleR.score) {
		p2Score.textContent = data.paddleR.score;
		animateScore(p2Score);
	}
	if (p1Score.textContent != data.paddleL.score) {
		p1Score.textContent = data.paddleL.score;
		animateScore(p1Score);
	}
}

function connectWebSocket() {

    if (gameSocket !== null && gameSocket.readyState === WebSocket.OPEN) {
        return;
    }
    
    if (gameSocket !== null && gameSocket.readyState !== WebSocket.CLOSED) {
        gameSocket.close();
    }
}
    
    gameSocket = new WebSocket(
        'wss://'
        + window.location.host
        + '/ws/game/'
        );
        gameSocket.onclose = function (e) {
        };
        
        gameSocket.onerror = function (error) {
            if (gameSocket.readyState == WebSocket.OPEN) {
        };
        
        function init_connection(e) {
            if (check_token()) {
                gameSocket.send(JSON.stringify({
                    'type': "login", 'jwtToken': getCookie("access")  
                })); 
            }
        } 
        
        gameSocket.onopen = init_connection;
        
        gameSocket.onmessage = function (e) {
            // Fonction qui s'execute quand on recoit un websocket
            // On recoit du texte mais generalement a parser en format Json
            // const data = JSON.parse(e.data);
		let message = JSON.parse(e.data);
		if (message.type == "initialize") {
			startButton.style.display = 'none';
			pauseButton.style.display = 'none';
			restartButton.style.display = 'none';
			gameManagement.style.display = 'none';
			homeButton.style.display = 'none';
			pauseOverlay.style.display = 'none';
			document.getElementById("gameNav").style.display = 'none';
			$('#tournamentModal').modal('hide');
			reset_game();
			redirGame();
			beginTime = message.time;
			initNames(message.p1, message.p2);
			id = message.id;
			gameRunning = true;
			ingame = true;
		}
		else if (message.type == "stop") {
			if ((data.paddleR.score > data.paddleL.score && id == 1 ) || (data.paddleR.score < data.paddleL.score && id == 0 ))
				timerBg.innerHTML = 'YOU WON';
			if ((data.paddleR.score > data.paddleL.score && id == 0 ) || (data.paddleR.score < data.paddleL.score && id == 1 ))
				timerBg.innerHTML = 'YOU LOST';
			if (data.paddleR.score == data.paddleL.score && id <= 1)
				timerBg.innerHTML = 'DRAW';
			reset_game();
			gameRunning = false;
			timeLeft = 0;
		}
		else if (message.type == "rank") {
			tournament_ranking(message.list);
			pauseButton.style.display = 'none'; 
			startButton.style.display = 'block';
			gameManagement.style.display = 'block';
			homeButton.style.display = 'block';
			restartButton.style.display = 'block';
			pauseOverlay.style.display = 'block';
			document.getElementById('quitTournamentButton').style.display = 'none';
			document.getElementById("gameNav").style.display = 'block';
			ingame = false;
			timerBg.innerHTML = '';
		}
		else if (message.type == "tournament_update") {
			updateTournamentListWithData(message.message);
		}
		else if (message.type == "game_data") 
		{
			if (!gameRunning)
				return;
			let up = data.keys[0 + (2 * id)];
			let down = data.keys[1 + (2 * id)];
			let current = data.image;
			data = JSON.parse(message.data);
			
			while (liste.length > 0 && data.image >= liste[0]["image"])
				liste.shift();
			for (let i = 0; i < liste.length; i++) {
				data.keys[0 + (2 * id)] = liste[i]["keys"][0 + (2 * id)];
				data.keys[1 + (2 * id)] = liste[i]["keys"][1 + (2 * id)];
				simulate(data, ctx);
			}
			data.keys[0 + (2 * id)] = up;
			data.keys[1 + (2 * id)] = down;
			data.image = current;

			handleScore();
		}
		else if (message.type === 'send_update_tournaments') {
        updateTournamentListWithData(message.tournaments);
    } else if (message.type === 'joined_tournament') {
        document.getElementById('quitTournamentButton').style.display = 'block';
        showAlert('Successfully joined tournament!', 'success');
    } else if (message.type === 'quit_tournament') {
        document.getElementById('quitTournamentButton').style.display = 'none';
        showAlert('You have left the tournament!', 'success');
    } else if (message.type === 'is_in_tournament' && message.message == true) {
        document.getElementById('quitTournamentButton').style.display = 'block';
        showAlert('You are already in a tournament!', 'danger');
    } else if (message.type === 'error_tournament') {
        showAlert('Error joining tournament ' + message.message, 'danger');
    } else if (message.type === 'error') {
        ;
    }
    else {
        ;
    }
};

}

connectWebSocket();

document.addEventListener("keydown", (e) => {
    if (e.key == upKey1 && !e.repeat && id != 1)
    data.keys[0] = true;
if (e.key == downKey1 && !e.repeat && id != 1)
data.keys[1] = true;
if (e.key == upKey1 && !e.repeat && id == 1)
data.keys[2] = true;
if (e.key == downKey1 && !e.repeat && id == 1)
data.keys[3] = true;
if (e.key == upKey2 && !e.repeat && id == 2)
data.keys[2] = true;
    if (e.key == downKey2 && !e.repeat && id == 2)
        data.keys[3] = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key == upKey1 && !e.repeat && id != 1)
        data.keys[0] = false;
    if (e.key == downKey1 && !e.repeat && id != 1)
        data.keys[1] = false;
    if (e.key == upKey1 && !e.repeat && id == 1)
        data.keys[2] = false;
    if (e.key == downKey1 && !e.repeat && id == 1)
        data.keys[3] = false;
    if (e.key == upKey2 && !e.repeat && id == 2)
        data.keys[2] = false;
    if (e.key == downKey2 && !e.repeat && id == 2)
        data.keys[3] = false;
});

var timerBg = document.getElementById('timerBg');
var activatedTimer = true;
function startTimer(time) {
    if (timerBg.innerHTML != '<p id="timer">3</p>' && time > 0 && time <= 1000)
        timerBg.innerHTML = '<p id="timer">3</p>'
    if (timerBg.innerHTML != '<p id="timer">2</p>' && time > 1000 && time <= 2000)
        timerBg.innerHTML = '<p id="timer">2</p>'
    if (timerBg.innerHTML != '<p id="timer">1</p>' && time > 2000 && time <= 3000)
        timerBg.innerHTML = '<p id="timer">1</p>'
    if (timerBg.innerHTML != '<p id="timer">GO</p>' && time > 3000 && time <= 4000)
        timerBg.innerHTML = '<p id="timer">GO</p>'
    if (timerBg.innerHTML != '' && time > 4000)
        timerBg.innerHTML = ''
}

var progressBar = document.getElementById('progressBar');
function updateProgressBar(timeLeft) {

    progressBar.style.width = timeLeft + '%';
    progressBar.setAttribute('aria-valuenow', timeLeft);
}

function calculateTimeLeftPercentage(beginTime, gameDuration) {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - beginTime;
    var timeLeft = gameDuration - elapsedTime;

    timeLeft = Math.max(timeLeft, 0);

    var timeLeftPercentage = (timeLeft / gameDuration) * 100;

    return timeLeftPercentage;
}
var timeLeft;


function initNames(p1, p2) {
    p1Display.innerHTML = p1;
    p2Display.innerHTML = p2;
    openTimeBar();
}

function openTimeBar() {
    document.getElementById('timeBar').style.removeProperty('display');
}

function closeTimeBar() {
    document.getElementById('timeBar').style.display = 'none';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sanangle(angle) {
    if (angle < 0)
        return (2 * PI) + (angle % (2 * PI))
    return angle % (2 * PI);
}

var posIa1 = 0;
var speedIa1 = 0;

function find_pos_IA1() {
    let i = 0;
    if (data.image % ctx.fps)
        return
    let copy = JSON.parse(JSON.stringify(data));
    while (((sanangle(copy.ball.tv) > PI / 2 && sanangle(copy.ball.tv) < 3 * PI / 2) || copy.ball.x > - ctx.width / 4)
        && copy.ball.x > data.paddleL.x + ctx.paddlew + ctx.ballr && copy.scored == false && i < ctx.difficulty) {
        simulate(copy, ctx);
        i++;
    }
    posIa1 = copy.ball.y;
    speedIa1 = copy.ball.rv;
}

var posIa2 = 0;
var speedIa2 = 0;
function find_pos_IA2() {
    let i = 0;
    if (data.image % ctx.fps)
        return
    let copy = JSON.parse(JSON.stringify(data));
    while ((sanangle(copy.ball.tv) < PI / 2 || sanangle(copy.ball.tv) > 3 * PI / 2 || copy.ball.x < ctx.width / 4)
        && copy.ball.x < data.paddleR.x + ctx.ballr && copy.scored == false && i < ctx.difficulty) {
        simulate(copy, ctx);
        i++;
    }
    posIa2 = copy.ball.y;
    speedIa2 = copy.ball.rv;
}

var buffer = [];
function frame() {
    let target;
	if (id == 2)
		handleScore();
    if (!gameRunning) {
        beginTime = new Date().getTime() - timer;
        animate();
        return;
    }
    if (id == 2) {
        if (ia1) {
            data.keys[0] = false;
            data.keys[1] = false;
            find_pos_IA1();
            target = posIa1;
            if (speedIa1 > 200)
                target = target - ctx.paddleh / 2 + ctx.paddleh * (Math.random() - .5) * .9
            else if (target >= 0)
                target -= ctx.paddleh + ctx.paddlew;
            else
                target += ctx.paddlew;
            if (data.paddleL.y < target)
                data.keys[0] = true;
            if (data.paddleL.y > target)
                data.keys[1] = true;
        }

        if (ia2) {
            data.keys[2] = false;
            data.keys[3] = false;
            find_pos_IA2();
            target = posIa2;
            if (speedIa2 > 200)
                target = target - ctx.paddleh / 2 + ctx.paddleh * (Math.random() - .5) * .9
            else if (target >= 0)
                target -= ctx.paddleh + ctx.paddlew;
            else
                target += ctx.paddlew;
            if (data.paddleR.y < target)
                data.keys[2] = true;
            if (data.paddleR.y > target)
                data.keys[3] = true;
        }
    }
    timer = new Date().getTime() - beginTime;
    startTimer(timer);
    if (timer < 3000) {
        animate();
        return;
    }
    timeLeft = calculateTimeLeftPercentage(beginTime, ctx.gameDuration * 1000);
    updateProgressBar(timeLeft);
    data.image = Math.trunc(timer / 1000 * ctx.fps);
	buffer.push({'keys': [data.keys[0 + (2 * id)], data.keys[1 + (2 * id)]], 'image': data.image })
    if (id != 2 && gameSocket.readyState == WebSocket.OPEN && data.image % ctx.fpi == 0)
	{
        gameSocket.send(JSON.stringify( { 'type': 'game', "buffer" : buffer }));
		buffer = [];
	}
    liste.push({ 'keys': { ...data.keys }, 'image': data.image });
    simulate(data, ctx);
    animate();
}

$('#TournamentRankingModal').on('hidden.bs.modal', function (e) {
    showAlert('You have left the tournament!', 'success');
    clearTournamentRanking();
});

function tournament_ranking(list) {
    tbody.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
        let tr = "<tr>";
        tr += "<td>" + list[i].rank + "</td>"
        tr += "<td>" + list[i].username + "</td>";
        tr += "</tr>";
        tbody.innerHTML += tr;
    }
    $('#TournamentRankingModal').modal('show');
}

function clearTournamentRanking() {
    $('#TournamentRankingModal').modal('hide');
    tbody.innerHTML = '';

}

function logMessage(message) {
    document.getElementById('score').innerHTML += `${message}<br>`;
}

// Partie de Julien
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let my = 0;
let light_pow = 100
let fov = 30;
let fov_deg;
let fovx;
let fovy;
let fov_fact = 30;
let fov_min = 5;
let fov_max = 180;

function updatefov() {
    //fov = fov_max - (fov_max-fov_min)*fov_fact/(data.ball.rv-ballv+fov_fact)
    fovx = fov * PI / 180;
    fovy = fovx;
    if (window.innerHeight > window.innerWidth) {
        fovy = 2 * Math.atan(Math.tan(fovx / 2) * window.innerHeight / window.innerWidth);
    } else {
        fovx = 2 * Math.atan(Math.tan(fovy / 2) * window.innerWidth / window.innerHeight);
    }
    fov_deg = fovy / PI * 180;
}

function cameraZ() {
    return Math.max((ctx.width + ctx.lengoal * 2) / (2. * Math.tan(fovx / 2.)), ctx.height * 1.4 / (2. * Math.tan(fovy / 2.)));
}

const scene = new THREE.Scene();
// const explosionEffect = new ExplosionEffect(scene);
// scene.add(explosionEffect.particleGroup);
scene.background = new THREE.Color(0.01, 0.01, 0.01);

updatefov();
const camera = new THREE.PerspectiveCamera(fov_deg, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.set(0, 0, cameraZ());
camera.lookAt(0, 0, 0);

const gameContainer = document.getElementById('gameContainer');
const renderer = new THREE.WebGLRenderer();
gameContainer.appendChild(renderer.domElement);
gameContainer.appendChild(pauseOverlay);
const gameElement = renderer.domElement;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//document.addEventListener("mousemove", mouseevent);
window.addEventListener("resize", windowsresize);

const geometry_pad = new THREE.CapsuleGeometry(ctx.paddlew / 2., ctx.paddleh, 10, 30);
const geometry_ball = new THREE.SphereGeometry(data.ball.r, 10, 30);
const geometry_edge = new THREE.CylinderGeometry(ctx.paddlew, ctx.paddlew, ctx.width * 2., 60);
const material_lit = new THREE.MeshPhongMaterial({ color: 0xffffff });
const material_unlit = new THREE.MeshBasicMaterial({ color: 0x0000ff });

let arrball = [];
let len = 10;
arrball.length = len;
for (let i = 0; i < len; ++i) {
    arrball[i] = new THREE.Mesh(geometry_ball, material_unlit);
    arrball[i].scale.set((i + 1) / len, (i + 1) / len, (i + 1) / len);
    scene.add(arrball[i]);
}
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 0; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderPass);
bloomComposer.addPass(bloomPass);

const padl = new THREE.Mesh(geometry_pad, material_lit);
scene.add(padl);
padl.castShadow = true;

const padr = new THREE.Mesh(geometry_pad, material_lit);
scene.add(padr);
padr.castShadow = true;

const edgeu = new THREE.Mesh(geometry_edge, material_lit);
scene.add(edgeu);
edgeu.receiveShadow = true;
edgeu.rotation.z = 3.1415926535 / 2;
edgeu.position.y = ctx.height / 2 + ctx.paddlew;

const edged = new THREE.Mesh(geometry_edge, material_lit);
scene.add(edged);
edged.receiveShadow = true;
edged.rotation.z = 3.1415926535 / 2;
edged.position.y = -ctx.height / 2 - ctx.paddlew;

const light = new THREE.PointLight(0x0000ff, data.ball.r * data.ball.r * light_pow);
light.castShadow = true;
scene.add(light);

const amblight = new THREE.AmbientLight(0xffffff, .01);
scene.add(amblight);

let rot = 0;

var p1Score = document.getElementById('player1Score');
var p2Score = document.getElementById('player2Score');

function animate() {
    //  updatefov();
    //camera.fov = fov_deg;
    //  camera.updateProjectionMatrix();
    //camera.position.set(0, 0, cameraZ());
    if (data.scored == false)
        for (let i = 0; i < len; ++i)
            scene.add(arrball[i]);
    else
        for (let i = 0; i < len; ++i)
            scene.remove(arrball[i]);

    if (isColorChangeEnabled) {
        light.color.offsetHSL(0.003, 0, 0);
        material_unlit.color.offsetHSL(0.003, 0, 0);
    }
    for (let i = 0; i < len - 1; ++i) {
        arrball[i].position.set(arrball[i + 1].position.x, arrball[i + 1].position.y, arrball[i + 1].position.z,);
    }
    arrball[len - 1].position.set(data.ball.x, data.ball.y, 0);
    light.position.set(data.ball.x, data.ball.y, 0);
    padl.position.set(data.paddleL.x + ctx.paddlew / 2, data.paddleL.y + ctx.paddleh / 2, 0);
    padr.position.set(data.paddleR.x + ctx.paddlew / 2, data.paddleR.y + ctx.paddleh / 2, 0);

    rot += 0.002;
    //camera.position.set(Math.sin(rot)*5,0,Math.cos(rot)*5);
    //camera.up.set(Math.cos(rot)*5,0,Math.sin(rot)*-5);
    camera.lookAt(0, 0, 0);

    //renderer.render(scene, camera);
    bloomComposer.render();
}

function mouseevent(event) {
    my = event.clientY / window.innerHeight * -2 + 1;
}

function windowsresize() {
    updatefov();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = fov_deg;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, cameraZ());
}

// document.addEventListener('DOMContentLoaded', function () {
//     const toggleColorChangeCheckbox = document.getElementById('toggleColorChange');

//     toggleColorChangeCheckbox.addEventListener('change', function () {
//         isColorChangeEnabled = this.checked;
//     });
// });
//frame();

setInterval(frame, 1000 / ctx.fps)


export { gameSocket };