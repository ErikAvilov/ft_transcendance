/* ======================================================================================================
# SECTION: AUDIO
======================================================================================================== */

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let backgroundMusicBuffer;
let currentGainNode = audioContext.createGain();
let gainNode = 0.5;
const backgroundMusicPath = "static/assets/mood_sound.mp3";
let isMusicPlaying = false;


function startMusic() {
    if (!backgroundMusicBuffer) {
        loadBackgroundMusic(backgroundMusicPath);
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function loadBackgroundMusic(url) {
	fetch(url)
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
		.then(decodedData => {
			backgroundMusicBuffer = decodedData;
			playBackgroundMusic();
		})
		.catch(error => console.error('Error loading background music:', error));
}

function playBackgroundMusic() {
    if (backgroundMusicBuffer) {
        const musicSource = audioContext.createBufferSource();
        musicSource.buffer = backgroundMusicBuffer;
        musicSource.loop = true;

        musicSource.connect(currentGainNode);
        currentGainNode.connect(audioContext.destination);

        musicSource.start(0);
        isMusicPlaying = true;
    }
}

function setVolume(value) {
	if (currentGainNode) {
		currentGainNode.gain.value = value;
	}
}


window.toggleMusic = function () {
	const volumeIcon = document.getElementById('volumeIcon');

	if (isMusicPlaying) {
		stopBackgroundMusic();
		volumeIcon.classList.remove('bi-volume-up');
		volumeIcon.classList.add('bi-volume-mute');
		isMusicPlaying = false;
	} else {
		startMusic();
		volumeIcon.classList.remove('bi-volume-mute');
		volumeIcon.classList.add('bi-volume-up');
		isMusicPlaying = true;
	}
}

function stopBackgroundMusic() {

	if (audioContext) {
		audioContext.suspend();
	}
}

