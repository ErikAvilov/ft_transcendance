import * as profile from "./ProfilePage/profile.js";
import * as settings from "./ProfilePage/settings.js";
import * as history  from "./ProfilePage/history.js";
import * as details  from "./ProfilePage/details.js";
import * as friend from "./ProfilePage/friendlist.js";

import { attachListListener } from "./FriendPage/friends.js";
import { attachVisitHistoryListener } from "./FriendPage/visit.js";

import { attachHomeListeners } from "./home.js"

import { attachLoginListener } from "./authentication/login.js"
import { attachRegListener } from "./authentication/register.js"

import { handle_token , check_token } from "./jwt.js";

async function callRequest(type, url, dataType, Listener, id) {
	$.ajax({
		type: type,
		url: url,
		dataType: dataType,
		data: {'user_id' : id},
		beforeSend: async function(request) {
			handle_token(request);
		},
		success: async function(data) {
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('main_page').innerHTML = data;
			Listener(id);
		},
		error: async function(error) {
			console.error('Error loading: ', url);
		},
	});
}

const timer = document.getElementById('timerBg');
const routes = {
	'#home': () => {
		hideAll();
		callRequest('GET', 'loadHome/', 'text', attachHomeListeners, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#game': () => {
			hideAll();
			document.getElementById('homenav').style.display = 'none';
			document.getElementById('game').style.display = 'block';
			document.getElementById('app').style.display = 'block';
			timer.style.display = 'block';
	},
	/*  Melhior  */
	'#login': () => {
		if (!check_token()) {
			hideAll();
			callRequest('GET', 'loadLogin/', 'text', attachLoginListener, undefined);
			document.getElementById('main_page').style.display = 'block';
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#register': () => {
		if (!check_token()) {
			hideAll();
			callRequest('GET', 'loadRegister/', 'text', attachRegListener, undefined);
			document.getElementById('main_page').style.display = 'block';
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#profile_page': () => {
		callRequest('GET', 'account_profile_page/', 'text', profile.attachProfileListener, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#profile_settings': () => {
		callRequest('GET', 'account/', 'text', settings.attachSettingsListeners, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#game_history': () => {
		callRequest('GET', 'game_history/', 'text', history.attachHistoryListeners, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#game_details': () => {
		callRequest('GET', 'game_details/', 'text', details.attachGameChartListener, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#friend_list': () => {
		callRequest('GET', 'list/', 'text', attachListListener, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
	'#friend_requests': () => {
		callRequest('GET', 'friend_requests/', 'text', friend.attachRequestListeners, undefined);
		document.getElementById('main_page').style.display = 'block';
	},
};

async function loadProfile(user_id) {
	callRequest('GET', 'account_profile_page/', 'text', attachVisitHistoryListener, user_id);
	document.getElementById('main_page').style.display = 'block';
}

async function loadHistory(user_id) {
	callRequest('GET', 'game_history/', 'text', history.attachHistoryListeners, user_id);
	document.getElementById('main_page').style.display = 'block';
}

async function loadDetails(game_id) {
	callRequest('GET', 'game_details/', 'text', details.attachGameChartListener, game_id);
	document.getElementById('main_page').style.display = 'block';
}

async function hideAll() {
	document.getElementById('app').style.display = 'none';
	document.getElementById('game').style.display = 'none';
	document.getElementById('main_page').style.display = 'none';
	document.getElementById('forbidden').style.display = 'none';
	timer.style.display = 'none';
}

async function handleHashChange() {
	const hash = window.location.hash;
	const routeAction = routes[hash];
	if (check_token()) {
		if (ingame)
		{
			routes["#game"]();
			return;
		}
		const profileMatch = hash.match(/^#profile_page\/(\d+)$/);
		const historyMatch = hash.match(/^#game_history\/(\d+)$/);
		const detailsMatch = hash.match(/^#game_details\/(\d+)$/);
		if (profileMatch) {
			console.log('1');
			loadProfile(profileMatch[1]);
		}
		else if (historyMatch) {
			console.log('here');
			loadHistory(historyMatch[1]);
		} 
		else if (detailsMatch) {
			console.log('3');
			loadDetails(detailsMatch[1]);
		} else {
			if (routeAction) {
				routeAction();
			} else {
				window.location.hash = '#home';
				console.log('Returning home due to an unforeseen consequence...');
			}
		}
	} 
	else if (window.location.hash == '#register') {
		if (routeAction)
			routeAction();
	}
	else {
		window.location.hash = '#login';
		if (routeAction)
			routeAction();
	}
		
}

window.addEventListener('hashchange', handleHashChange);

handleHashChange();
