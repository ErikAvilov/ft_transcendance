import { lang_switcher } from "./languages.js";
import { handle_token , fetchNewjwtToken , getCookie , setCookie, check_token} from "./jwt.js"
import { gameSocket } from "./game-physics.js"

const logoutbtn = document.getElementById("logout");
const langbtn = document.getElementById("lang_func");

const login_page = document.getElementById("loginbtn");

export async function attachLoginListener() {
	console.log('attached!');
	console.log(document.getElementById('test_ttt'));
	const oauth_btn = document.getElementById('oauth_btn');
	const loginbtn = document.getElementById("loginForm");
	const testbtn = document.getElementById('test_ttt');
	if (oauth_btn) {
		oauth_btn.addEventListener('click', async function(){
			var totpCode = document.getElementById("totp_code").value;
			window.location.href = `/authenticate_42/?code=${totpCode}`;
		})
	}
	if (loginbtn) {
		loginbtn.addEventListener('click', function(event) {
			event.preventDefault();
			console.log('bite');
			// $.ajax({
			// 	type: 'POST',
			// 	url: 'login/',
			// 	data: {'username': document.getElementById('id_username').value,
			// 			'password': document.getElementById('id_password').value,
			// 			'totp_code': document.getElementById('totp_code').value,
			// 			csrfmiddlewaretoken: csrf_token},
			// 	dataType: 'json',
			// 	success: function(response) {
			// 		if (response.success) {
			// 			fetchNewCSRFToken();
			// 			fetchNewjwtToken(document.getElementById('id_username').value, document.getElementById('id_password').value);
			// 			gameSocket.send(JSON.stringify({
			// 				'type': "login", 'jwtToken': getCookie("access")
			// 			}));
			// 			document.getElementById('loginForm').reset();
			// 			redirHome();
			// 		} else {
			// 			showAlert('Login error : ' + response.message, 'danger')
			// 			document.getElementById('id_password').value = null;
			// 			document.getElementById('id_password').placeholder = response.message;
			// 		}
			// 	},
			// 	error: function(error) {
			// 		console.error('Error:', error);
			// 	},
			// });
		});
	}
	if (testbtn) {
		testbtn.addEventListener('click', function() {
			console.log('bite');
		});
	}
}


export async function attachRegListener() {
	const regform = document.getElementById("registerForm");
	if (regform) {
		regform.addEventListener('submit', async function(event) { // Registration
			event.preventDefault();
			console.log('click!');
			// var formData = {};
			// $('#registerForm').serializeArray().forEach(function(item) {
			// 	formData[item.name] = item.value;
			// });
			// formData['csrfmiddlewaretoken'] = csrf_token;
			// $.ajax({
			// 	type: 'POST',
			// 	url: 'register/',
			// 	dataType: 'json',
			// 	data: formData,
			// 	success: function(response) {
			// 		if (response.success) {
			// 			showAlert('Succesfully registered !', 'success');
			// 			document.getElementById('registerForm').reset();
			// 			displayLoginPage();
			// 		} else { 
			// 			if (response.error == "User already exists")
			// 				showAlert('Registration failed : ' + response.error, 'danger');
			// 			else {
			// 				showAlert('Registration failed : ' + response.error, 'danger');
			// 				document.getElementById('register_password1').value = "";
			// 				document.getElementById('register_password2').value = "";
			// 				document.getElementById('register_password1').placeholder = response.error;
			// 				document.getElementById('register_password2').placeholder = response.error;
			// 			}
			// 		}
			// 	},
			// 	error: function(error) {
			// 		showAlert('Registration failed : ' + error, 'danger');
			// 	},
			// });
		});
	}
}

logoutbtn.addEventListener('click', async function(event) { // Logout
		event.preventDefault();
		if (check_token())
		{
			$.ajax({
				type: 'POST',
				url: 'logout_user/',
				dataType: 'json',
				data: {csrfmiddlewaretoken: csrf_token},
				beforeSend: function(request) {
					handle_token(request);
				},
				success: function(response) {
					setCookie("access", "", 0);
					setCookie("refresh", "", 0);
					gameSocket.send(JSON.stringify({
						'type': "logout"
					}));
					displayLoginPage();
					if (response.success)
						showAlert('Logout succesful!', 'success');
					else 
						showAlert('Logout failed!', 'danger');
				},
				error: function(error) {
					setCookie("access", "", 0);
					setCookie("refresh", "", 0);
					gameSocket.send(JSON.stringify({
						'type': "logout"
					}));
					displayLoginPage();
					console.error('Error logout :', error);
				},
			});
		}
})

/*  language switchers  */

window.onload = async function() {

    document.querySelectorAll('#lang_func .dropdown-item').forEach(item => {
        item.addEventListener('click', async function(event) {
            event.preventDefault();
            const language = this.getAttribute('data-value');
			
            changeLanguage(language); 
        });
    });
};


function changeLanguage(language) {
   
    lang_switcher(language);
	if (check_token())
	{
		$.ajax({
			type: 'POST',
			url: 'changeLanguage/',
			data: {'language': language, csrfmiddlewaretoken: csrf_token}, 
			dataType: 'json',
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(response) {
				if (response.success) {
					showAlert('Language changed', 'success');
				} else {
					showAlert('Language change failed', 'danger');
				}
			},
			error: function(error) {
			}
		});
	}
}

// creates a new csrf token because for some reason either the navigator or django updates his
// and django doesn't accept the initial one
// good thing django has a built-in function for that
function fetchNewCSRFToken() {
	if (check_token())
	{
		$.ajax({
			type: 'GET',
			url: 'get-csrf-token/',
			dataType: 'json',
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(response) {
				csrf_token = response.csrf_token;
			},
			error: function(error) {
				console.error('Error fetching CSRF token:', error);
			}
		});
	}
}