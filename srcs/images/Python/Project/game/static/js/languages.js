async function allFrench() {
	document.getElementById('ball_color').textContent = "Changement de couleur de la balle";
	document.getElementById('offcanvasNavbarLabel').textContent = "Gestion de la partie";
	document.getElementById('tournament_display').textContent = "Gestion du tournoi";

	document.getElementById('forbidden_message_one').textContent = 'Requête interdite';
	document.getElementById('forbidden_message_two').textContent = 'Accès non autorisé';

	document.getElementById('tournamentModalLabel').textContent = 'Tournoi';
	document.getElementById('create-tab').textContent = 'Créer';
	document.getElementById('join-tab').textContent = 'Rejoindre';
	document.getElementById('tournamentParticipants').textContent = 'Nombre de participants';
	document.getElementById('tournamentPassword').textContent = 'Mot de passe du tournoi';
	document.getElementById('tournamentHost').textContent = 'Hôte';
	document.getElementById('tournamentPlayer').textContent = 'Joueurs';
	document.getElementById('tournamentAction').textContent = 'Action';
	document.getElementById('tournamentLaunch').textContent = 'Lancer tournoi';
	document.getElementById('participantError').textContent = 'Le nombre de participants doit être une puissance de 2 et supérieur à 3';
	
	document.getElementById('quickMatchButton').textContent = 'Partie rapide';
	document.getElementById('quitTournamentButton').textContent = "Quitter file d'attente";
	store( {
		20: "Changement de couleur de la balle",
		21: "Gestion de la partie",
		22: "Tableau de bord",
		23: "Gestion du tournoi",
		24: "Chercher un joueur",
		25: "Chercher",

		26: "Requête interdite",
		27: "Accès non autorisé",

		28: 'Tournoi',
		29: 'Créer',
		30: 'Rejoindre',
		31: 'Nombre de participants',
		32: 'Mot de passe du tournoi',
		33: 'Hôte',
		34: 'Joueurs',
		35: 'Action',
		36: 'Lancer tournoi',
		37: 'Le nombre de participants doit être une puissance de 2 et supérieur à 3',

		38: 'Partie rapide',
		39: "Quitter file d'attente",
	});
}

async function allEnglish() {
	document.getElementById('ball_color').textContent = "Ball color change";
	document.getElementById('offcanvasNavbarLabel').textContent = "Game manager";
	document.getElementById('tournament_display').textContent = "Tournament Manager";

	document.getElementById('forbidden_message_one').textContent = 'Forbidden Request';
	document.getElementById('forbidden_message_two').textContent = 'Unauthorized access';

	document.getElementById('tournamentModalLabel').textContent = 'Tournament';
	document.getElementById('create-tab').textContent = 'Create';
	document.getElementById('join-tab').textContent = 'Join';
	document.getElementById('tournamentParticipants').textContent = 'Number of participants';
	document.getElementById('tournamentPassword').textContent = 'Tournament Password';
	document.getElementById('tournamentHost').textContent = 'Host';
	document.getElementById('tournamentPlayer').textContent = 'Participants';
	document.getElementById('tournamentAction').textContent = 'Action';
	document.getElementById('tournamentLaunch').textContent = 'Launch tournament';
	document.getElementById('participantError').textContent = 'The number of participant must be a power of 2 and greater than 3';
	
	document.getElementById('quickMatchButton').textContent = 'Quick match';
	document.getElementById('quitTournamentButton').textContent = "Leave queue";
	store( {
		20: "Ball color change",
		21: "Game manager",
		22: "Dashboard",
		23: "Tournament Manager",
		24: "Search player profile",
		25: "Search",

		26: "Forbidden Request",
		27: "Unauthorized access",

		28: 'Tournament',
		29: 'Create',
		30: 'Join',
		31: 'Number of participants',
		32: 'Tournament Password',
		33: 'Host',
		34: 'Participants',
		35: 'Action',
		36: 'Launch tournament',
		37: 'The number of participant must be a power of 2 and greater than 3',

		38: 'Quick match',
		39: "Leave queue",
	})
}

async function allRussian() {
	document.getElementById('ball_color').textContent = "Изменение цвета шарика";
	document.getElementById('offcanvasNavbarLabel').textContent = "Управление игры";
	document.getElementById('tournament_display').textContent = "Управление турнира";

	document.getElementById('forbidden_message_one').textContent = 'Запрещенный запрос';
	document.getElementById('forbidden_message_two').textContent = 'Несанкционированный доступ';

	document.getElementById('tournamentModalLabel').textContent = 'Турнир';
	document.getElementById('create-tab').textContent = 'Создать';
	document.getElementById('join-tab').textContent = 'Присоединиться';
	document.getElementById('tournamentParticipants').textContent = 'Количество игроков';
	document.getElementById('tournamentPassword').textContent = 'Пароль турнина';
	document.getElementById('tournamentHost').textContent = 'Хозяйн';
	document.getElementById('tournamentPlayer').textContent = 'Игроки';
	document.getElementById('tournamentAction').textContent = 'Действия';
	document.getElementById('tournamentLaunch').textContent = 'Запустить';
	document.getElementById('participantError').textContent = 'Количество участников должно быть в степени 2 и превышать 3';
	
	document.getElementById('quickMatchButton').textContent = 'Быстрая игра';
	document.getElementById('quitTournamentButton').textContent = "Покинуть очередь";

	store( {
		20: "Изменение цвета шарика",
		21: "Управление игры",
		22: "Приборная панель",
		23: "Управление турнира",
		24: "Искать игрока",
		25: "Искать",

		26: "Запрещенный запрос",
		27: "Несанкционированный доступ",

		28: 'Турнир',
		29: 'Создать',
		30: 'Присоединиться',
		31: 'Количество игроков',
		32: 'Пароль турнина',
		33: 'Хозяйн',
		34: 'Игроки',
		35: 'Действия',
		36: 'Запустить',
		37: 'Количество участников должно быть в степени 2 и превышать 3',
		
		38: 'Быстрая игра',
		39: 'Покинуть очередь',
	})
}

async function store(words) {
	localStorage.setItem('ball_color', words[20]);
	localStorage.setItem('game_manager', words[21]);
	localStorage.setItem('dashboard', words[22]);
	localStorage.setItem('tourn_manager', words[23]);
	localStorage.setItem('search_player', words[24]);
	localStorage.setItem('search', words[25]);
	localStorage.setItem('warning1', words[26]);
	localStorage.setItem('warning2', words[27]);
	localStorage.setItem('tournament', words[28]);
	localStorage.setItem('create', words[29]);
	localStorage.setItem('join', words[30]);
	localStorage.setItem('parti_nbr', words[31]);
	localStorage.setItem('tourn_pass', words[32]);
	localStorage.setItem('host', words[33]);
	localStorage.setItem('players', words[34]);
	localStorage.setItem('action', words[35]);
	localStorage.setItem('launch', words[36]);
	localStorage.setItem('tourn_warning', words[37]);
	localStorage.setItem('quickMatch', words[38]);
	localStorage.setItem('leaveQueue', words[39]);
}

async function loadPref() {
	const	bool = localStorage.getItem('bool')
	if (bool == 'bite') // 'True' so it works
	{
		document.getElementById('ball_color').textContent = localStorage.getItem('ball_color');
		document.getElementById('offcanvasNavbarLabel').textContent = localStorage.getItem('game_manager');
		document.getElementById('tournament_display').textContent = localStorage.getItem('tourn_manager');
		document.getElementById('forbidden_message_one').textContent = localStorage.getItem('warning1');
		document.getElementById('forbidden_message_two').textContent = localStorage.getItem('warning2');
		document.getElementById('tournamentModalLabel').textContent = localStorage.getItem('tournament');
		document.getElementById('create-tab').textContent = localStorage.getItem('create');
		document.getElementById('join-tab').textContent = localStorage.getItem('join');
		document.getElementById('tournamentParticipants').textContent = localStorage.getItem('parti_nbr');
		document.getElementById('tournamentPassword').textContent = localStorage.getItem('tourn_pass');
		document.getElementById('tournamentHost').textContent = localStorage.getItem('host');
		document.getElementById('tournamentPlayer').textContent = localStorage.getItem('players');
		document.getElementById('tournamentAction').textContent = localStorage.getItem('action');
		document.getElementById('tournamentLaunch').textContent = localStorage.getItem('launch');
		document.getElementById('participantError').textContent = localStorage.getItem('tourn_warning');
		document.getElementById('quickMatchButton').textContent = localStorage.getItem('quickMatch');
		document.getElementById('quitTournamentButton').textContent = localStorage.getItem('leaveQueue');
	}
	else {
		allEnglish();
	}
	return ;
}

window.onload = async function() {
	document.getElementById("lang_func").onchange = async function() {
		lang_switcher(this.value);
	}
}

export async function	 lang_switcher(value) {
	if (value == 'French')
		allFrench();
	else if (value == 'English')
		allEnglish();
	else if (value == 'Russian')
		allRussian();
}

// loadPref();