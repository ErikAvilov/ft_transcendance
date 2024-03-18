async function allFrench() {
	document.getElementById("pongDesc").innerText = 'Le pong original, mais pas trop.';
	document.getElementById("playbtn").innerText = 'Jouer au jeu';
	document.getElementById("loginbtn").innerText = 'Se connecter';
	document.getElementById("loginbtn2").innerText = 'Se connecter';
	document.getElementById("totp_code").placeholder = "Insérez le code secret si nécessaire";
	/* login/register page  */
	document.getElementsByClassName(" requiredField")[0].innerText = "Nom d'utilisateur";
	document.getElementsByClassName(" requiredField")[1].innerText = "Mot de passe";
	document.getElementsByClassName(" requiredField")[2].innerText = "Nom d'utilisateur";
	document.getElementsByClassName(" requiredField")[3].innerText = "Mot de passe";
	document.getElementsByClassName(" requiredField")[4].innerText = "Confirmez le mot de passe";
	document.querySelector('label[for="register_email"]').textContent = "Adresse mail";

	document.getElementById("hint_register_username").innerText = "Requis. 150 caractères ou moins. Lettres, chiffres et @/./+/-/_ uniquement."
	document.getElementById("hint_register_password2").innerText = "Entrez le même mot de passe pour confirmation.";
	document.getElementById("regbtn").innerHTML = "S'enregistrer";
	document.getElementById("accbtn").innerHTML = "Vous avez déjà un compte ?"
	document.getElementById("noaccbtn").innerHTML = "Vous n'avez pas de compte ? Créez ici";
	document.getElementById("profview").innerText = "Page de Profil";
	document.getElementById("logout").innerText = "Se déconnecter";
	document.getElementById("homebtn").innerText = "Page d'accueil";

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
	var regWords = {
		0: 'Votre mot de passe ne doit pas être trop similaire à vos informations personnels.',
		1: 'Votre mot de passe doit contenir au moins 8 caractères.',
		2: 'Votre mot de passe ne doit pas être un mot de passe utilisé couramment.',
		3: 'Votre mot de passe ne doit pas être entièrement numérique.'
	}; fillRegisterPage(regWords);
	store( {
		0: 'True', 
		1: "Nom d'utilisateur", 
		2: "Mot de passe",
		3: "Confirmez le mot de passe",
		4: "Adresse mail",
		5: "Requis. 150 caractères ou moins. Lettres, chiffres et @/./+/-/_ uniquement.",
		6: "Entrez le même mot de passe pour confirmation.",
		7: "S'enregistrer",
		8: "Vous avez déjà un compte ?",
		9: "Vous n'avez pas de compte ? Créez ici",

		10: "Votre mot de passe ne doit pas être trop similaire à vos informations personnels.",
		11: "Votre mot de passe doit contenir au moins 8 caractères.",
		12: "Votre mot de passe ne doit pas être un mot de passe utilisé couramment.",
		13: "Votre mot de passe ne doit pas être entièrement numérique.",

		14: "Page de Profil",
		15: "Jouer au jeu",
		16: "Se déconnecter",
		17: "Le pong original, mais pas trop.",
		18: "Page d'accueil",
		19: "Se connecter",

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
	document.getElementById("pongDesc").innerText = 'The original pong, but not that much.';
	document.getElementById("playbtn").innerText = 'Play the Game';
	document.getElementById("loginbtn").innerText = 'Login';
	document.getElementById("loginbtn2").innerText = 'Login';
	document.getElementById("totp_code").placeholder = "Enter OTP code if required";

	document.getElementsByClassName(" requiredField")[0].innerText = "Username";
	document.getElementsByClassName(" requiredField")[1].innerText = "Password";
	document.getElementsByClassName(" requiredField")[2].innerText = "Username";
	document.getElementsByClassName(" requiredField")[3].innerText = "Password";
	document.getElementsByClassName(" requiredField")[4].innerText = "Confirm password";
	document.querySelector('label[for="register_email"]').textContent = "Email address";

	document.getElementById("hint_register_username").innerText = "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.";
	document.getElementById("hint_register_password2").innerText = "Enter the same password as before, for verification.";
	document.getElementById("regbtn").innerHTML = "Register";
	document.getElementById("accbtn").innerHTML = "Already have an account?"
	document.getElementById("noaccbtn").innerHTML = "Don't have an account? Sign up here";
	document.getElementById("profview").innerText = "Profile Page";
	document.getElementById("logout").innerText = "Logout";
	document.getElementById("homebtn").innerText = "Home";

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
	var regWords = {
		0: "Your password can't be too similar to your other personal information.",
		1: "Your password must contain at least 8 characters.",
		2: "Your password can't be a commonly used password.",
		3: "Your password can't be entirely numeric."
	}; fillRegisterPage(regWords);
	store( {
		0: 'True', 
		1: "Login", 
		2: "Password",
		3: "Confirm password",
		4: "Email address",
		5: "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
		6: "Enter the same password as before, for verification.",
		7: "Register",
		8: "Already have an account?",
		9: "Don't have an account? Sign up here",

		10: "Your password can't be too similar to your other personal information.",
		11: "Your password must contain at least 8 characters.",
		12: "Your password can't be a commonly used password.",
		13: "Your password can't be entirely numeric.",

		14: "Profile Page",
		15: "Play the Game",
		16: "Logout",
		17: "The original pong, but not that much.",
		18: "Home",
		19: "Login",

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
	document.getElementById("pongDesc").innerText = 'Оригинальный понг, но не на столько.';
	document.getElementById("playbtn").innerText = 'Играть в игру';
	document.getElementById("loginbtn").innerText = 'Войти';
	document.getElementById("loginbtn2").innerText = 'Вход';
	document.getElementById("totp_code").placeholder = "Введите секретный код если необходимо";

	document.getElementsByClassName(" requiredField")[0].innerText = "Имя пользователя";
	document.getElementsByClassName(" requiredField")[1].innerText = "Пароль";
	document.getElementsByClassName(" requiredField")[2].innerText = "Имя пользователя";
	document.getElementsByClassName(" requiredField")[3].innerText = "Пароль";
	document.getElementsByClassName(" requiredField")[4].innerText = "Подтвердите пароль";
	document.querySelector('label[for="register_email"]').textContent = "Адрес электронной почты";

	document.getElementById("hint_register_username").innerText = "Необходимый. 150 символов или меньше. Только буквы, цифры и @/./+/-/_.";
	document.getElementById("hint_register_password2").innerText = "Введите тот же пароль, для проверки.";
	document.getElementById("regbtn").innerHTML = "Регистрация";
	document.getElementById("accbtn").innerHTML = "Уже есть аккаунт?"
	document.getElementById("noaccbtn").innerHTML = "Нет аккаунта? Создайте тут";
	document.getElementById("profview").innerText = "Профил";
	document.getElementById("logout").innerText = "Отключиться";
	document.getElementById("homebtn").innerText = "Главная страница";

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
	var regWords = {
		0: 'Ваш пароль не должен быть слишком похож на другую вашу личную информацию.',
		1: 'Ваш пароль должен содержать не менее 8 символов.',
		2: 'Ваш пароль не может быть широко используемым паролем.',
		3: 'Ваш пароль не может быть полностью числовым.'
	}; fillRegisterPage(regWords);

	store( {
		0: 'True', 
		1: "Имя пользователя", 
		2: "Пароль",
		3: "Подтвердите пароль",
		4: "Адрес электронной почты",
		5: "Необходимый. 150 символов или меньше. Только буквы, цифры и @/./+/-/_.",
		6: "Введите тот же пароль, для проверки.",
		7: "Регистрация",
		8: "Уже есть аккаунт?",
		9: "Нет аккаунта? Создайте тут",

		10: "Ваш пароль не должен быть слишком похож на другую вашу личную информацию.",
		11: "Ваш пароль должен содержать не менее 8 символов.",
		12: "Ваш пароль не может быть широко используемым паролем.",
		13: "Ваш пароль не может быть полностью числовым.",

		14: "Профил",
		15: "Играть в игру",
		16: "Отключиться",
		17: "Оригинальный понг, но не на столько.",
		18: "Главная страница",
		19: "Войти",

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

async function fillRegisterPage(words) {
	var list = document.querySelector('#hint_register_password1 ul');
	if (list)
	{
		var items = list.querySelectorAll('li');
		items.forEach(async function(item, i) {
			 item.textContent = words[i]
		});
	}
}

async function store(words) {
	localStorage.setItem('bool', words[0]);
	localStorage.setItem('login_form', words[1]);
	localStorage.setItem('pass_form', words[2]);
	localStorage.setItem('conf_pass_form', words[3]);
	localStorage.setItem('mail_form', words[4]);
	localStorage.setItem('hint_user', words[5]);
	localStorage.setItem('same_pass', words[6]);
	localStorage.setItem('reg_btn', words[7]);
	localStorage.setItem('acc_btn', words[8]);
	localStorage.setItem('no_acc_btn', words[9]);
	localStorage.setItem('pass_hint1', words[10]);
	localStorage.setItem('pass_hint2', words[11]);
	localStorage.setItem('pass_hint3', words[12]);
	localStorage.setItem('pass_hint4', words[13]);
	localStorage.setItem('profview', words[14]);
	localStorage.setItem('play_game', words[15]);
	localStorage.setItem('logout', words[16]);
	localStorage.setItem('description', words[17]);
	localStorage.setItem('Homepage', words[18]);
	localStorage.setItem('login_btn', words[19]);
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
		document.getElementsByClassName(" requiredField")[0].innerText = localStorage.getItem('login_form');
		document.getElementsByClassName(" requiredField")[1].innerText = localStorage.getItem('pass_form');
		document.getElementsByClassName(" requiredField")[2].innerText = localStorage.getItem('login_form');
		document.getElementsByClassName(" requiredField")[3].innerText = localStorage.getItem('pass_form');
		document.getElementsByClassName(" requiredField")[4].innerText = localStorage.getItem('conf_pass_form');
		document.querySelector('label[for="register_email"]').textContent = localStorage.getItem('mail_form');
		document.getElementById("hint_register_username").innerText = localStorage.getItem('hint_user');
		document.getElementById("hint_register_password2").innerText = localStorage.getItem('same_pass');
		document.getElementById("regbtn").innerHTML = localStorage.getItem('reg_btn');
		document.getElementById("accbtn").innerHTML = localStorage.getItem('acc_btn');
		document.getElementById("noaccbtn").innerHTML = localStorage.getItem('no_acc_btn');
		document.getElementById("profview").innerText = localStorage.getItem('profview');
		document.getElementById("playbtn").innerText = localStorage.getItem('play_game');
		document.getElementById("logout").innerText = localStorage.getItem('logout');
		document.getElementById("pongDesc").innerText = localStorage.getItem('description');
		document.getElementById("homebtn").innerText = localStorage.getItem('Homepage');
		document.getElementById("loginbtn").innerText = localStorage.getItem('login_btn');
		document.getElementById('ball_color').textContent = localStorage.getItem('ball_color');
		document.getElementById('offcanvasNavbarLabel').textContent = localStorage.getItem('game_manager');
		document.getElementById('tournament_display').textContent = localStorage.getItem('tourn_manager');
		document.getElementById('forbidden_message_one').textContent = localStorage.getItem('warning1');
		document.getElementById('forbidden_message_two').textContent = localStorage.getItem('warning2');
		fillRegisterPage({
			0: localStorage.getItem('pass_hint1'),
			1: localStorage.getItem('pass_hint2'),
			2: localStorage.getItem('pass_hint3'),
			3: localStorage.getItem('pass_hint4'),
		});
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