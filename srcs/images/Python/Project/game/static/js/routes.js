import { attachEventListeners, attachHistoryListener, attachTfaListener, attachBackBtnListener} from "./Profile.js";
import { attachSearchListener, attachListListener, attachAcceptListeners, attachDeclineListeners, attachVisitHistoryListener } from "./friends.js";
import { handle_token , getCookie , check_token } from "./jwt.js";
import { attachHistoryChartListener } from "./chart.js"
import { attachGameChartListener, attachGameListListener } from "./chart.js"
import { attachRegListener, attachLoginListener } from "./authentication.js"

async function callRequest(type, url, dataType) {
	$.ajax({
		type: type,
		url: url,
		dataType: dataType,
		beforeSend: function(request) {
			handle_token(request);
		},
		success: function(data) {
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('main_page').innerHTML = data;
		},
		error: function(error) {
			console.error('Error loading: ', url);
		},
	});
}

const timer = document.getElementById('timerBg');
const routes = {
	'#home': () => {
		hideAll();
		document.getElementById('home').style.display = 'block';
		document.getElementById('homenav').style.display = 'block';
		document.getElementById('tournament_display').style.display = 'block';
		document.getElementById('profview').style.display = 'block';
		document.getElementById('logout').style.display = 'block';
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
			callRequest('GET', 'loadLogin/', 'text');
			attachLoginListener();
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
			callRequest('GET', 'loadRegister/', 'text');
			attachRegListener();
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#2FA': () => {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
			document.getElementById('2FA').style.display = 'block';
	},
	'#profile_settings': () => {
		if (check_token()) {
			$.ajax({
				type: 'GET',
				url: 'account/',
				dataType: 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success: function(response) {
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = response;
					attachEventListeners();
					attachBackBtnListener();
					attachTfaListener();
					hideAll();
					document.getElementById('profile_page').style.display = 'block';
				},
				error: function(error) {
					console.error('Error:', error);
				},
			});
			}
		else {
			hideAll();
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#profile_page': () => {
		if (check_token()) {
			$.ajax ({
				type: 'GET',
				url: 'account_profile_page/',
				dataType : 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success : function(request) {
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = request;
					attachHistoryListener();
					attachSearchListener();
					hideAll();
					document.getElementById('profile_page').style.display = 'block';
				},
				error : function(error) {
					hideAll();
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('forbidden').style.display = 'block';
				}
			})
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#game_history': () => {
		if (check_token()) {
			$.ajax ({
				type: 'GET',
				url: 'game_history/',
				dataType : 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success : function(request) {
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = request;
					hideAll();
					document.getElementById('profile_page').style.display = 'block';
					attachBackBtnListener();
					attachHistoryChartListener();
					attachGameListListener();
				},
				error : function(error) {
					console.error('Error:', error);
				}
			});
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#game_details': () => {
		if (check_token()) {
			$.ajax ({
				type: 'GET',
				url: 'game_details/',
				dataType : 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success : function(request) {
					hideAll();
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = request;
					document.getElementById('profile_page').style.display = 'block';
					attachGameChartListener();
					attachBackBtnListener();
				},
				error : function(error) {
					console.error('Error:', error);
				}
			})
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#friend_list': () => {
		if (check_token()) {
			$.ajax ({
				type: 'GET',
				url: 'list/',
				dataType : 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success : function(request) {
					hideAll();
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = request;
					document.getElementById('profile_page').style.display = 'block';
					attachListListener();
					attachBackBtnListener();
				},
				error : function(error) {
					console.error('Error:', error);
				}
			})
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
	'#friend_requests': () => {
		if (check_token()) {
			$.ajax ({
				type: 'GET',
				url: 'friend_requests/',
				dataType : 'text',
				beforeSend: function(request) {
					handle_token(request);
				},
				success : function(request) {
					hideAll();
					document.getElementById('homenav').style.display = 'block';
					document.getElementById('profile_page').innerHTML = request;
					document.getElementById('profile_page').style.display = 'block';
					attachAcceptListeners();
					attachDeclineListeners();
					attachBackBtnListener();
				},
				error : function(error) {
					console.error('Error:', error);
				}
			});
		}
		else {
			hideAll();
			document.getElementById('homenav').style.display = 'block';
			document.getElementById('forbidden').style.display = 'block';
		}
	},
};

async function hideAll() {
	// document.getElementById('home').style.display = 'none';
	document.getElementById('app').style.display = 'none';
	document.getElementById('game').style.display = 'none';
	timer.style.display = 'none';
	//document.getElementById('homenav').style.display = 'none'; // frère pk c'est en none ????
	//document.getElementById('dmode-btn-container').style.display = 'none';
	//document.getElementById('volume-control').style.display = 'none';

	/*  Melhior  */

	// document.getElementById('register').style.display = 'none';
	// document.getElementById('login').style.display = 'none';
	document.getElementById('forbidden').style.display = 'none';

	document.getElementById('profile_page').style.display = 'none';
}

async function loadProfile(user_id) {
	if (check_token()) {
		$.ajax ({
			type: 'GET',
			url: 'account_profile_page/',
			dataType : 'text',
			data : {'user_id' : user_id},
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				hideAll();
				document.getElementById('profile_page').innerHTML = data;
				document.getElementById('profile_page').style.display = 'block';
				attachVisitHistoryListener(user_id);
			},
			error: function(data) {
			}
		});
	}
	else {
		hideAll();
		document.getElementById('homenav').style.display = 'block';
		document.getElementById('forbidden').style.display = 'block';
		document.getElementById('forbidden_message').innerText = "You are not registered";
	}
}

async function loadHistory(user_id) {
	if (check_token()) {
		$.ajax ({
			type: 'GET',
			url: 'game_history/',
			dataType : 'text',
			data : {'user_id' : user_id},
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				hideAll();
				document.getElementById('profile_page').innerHTML = data;
				document.getElementById('profile_page').style.display = 'block';
				attachHistoryChartListener();
				attachGameListListener();
				attachBackBtnListener();
			},
			error: function(data) {
			}
		});
	}
	else {
		hideAll();
		document.getElementById('homenav').style.display = 'block';
		document.getElementById('forbidden').style.display = 'block';
	}
}

async function loadDetails(game_id) {
	if (check_token()) {
		$.ajax ({
			type: 'GET',
			url: 'game_details/',
			dataType: 'text',
			data: {'game_id': game_id},
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				hideAll();
				document.getElementById('profile_page').innerHTML = data;
				document.getElementById('profile_page').style.display = 'block';
				attachGameChartListener();
				attachBackBtnListener();
			},
			error: function(data) {
			}
		});
	}
	else {
		hideAll();
		document.getElementById('homenav').style.display = 'block';
		document.getElementById('forbidden').style.display = 'block';
	}
}

async function handleHashChange() {
	const hash = window.location.hash;
	const routeAction = routes[hash];
	if (check_token()){
		if (ingame)
		{
			routes["#game"]();
			return;
		}
		const profileMatch = hash.match(/^#profile_page\/(\d+)$/);
		const historyMatch = hash.match(/^#game_history\/(\d+)$/);
		const detailsMatch = hash.match(/^#game_details\/(\d+)$/);
		if (profileMatch) {
			loadProfile(profileMatch[1]);
		}
		else if (historyMatch) {
			loadHistory(historyMatch[1]);
		} 
		else if (detailsMatch) {
			loadDetails(detailsMatch[1]);
		} else {
			if (routeAction) {
				routeAction();
			} else {
				window.location.hash = '#home';
				console.log('Returning home due to an unforeseen consequence...');
			}
		}
	} else if (window.location.hash == '#register'){
		if (routeAction)
			routeAction();
	}
	else {
		console.log(document.getElementById('main_page'))
		window.location.hash = '#login';
		if (routeAction)
			routeAction();
	}
		
}

window.addEventListener('hashchange', handleHashChange);

handleHashChange();
