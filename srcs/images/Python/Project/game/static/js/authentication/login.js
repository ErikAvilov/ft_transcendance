export async function attachLoginListener() {
	const oauth_btn = document.getElementById('oauth_btn');
	const loginbtn = document.getElementById("loginForm");
	if (oauth_btn) {
		oauth_btn.addEventListener('click', async function(){
			var totpCode = document.getElementById("totp_code").value;
			window.location.href = `/authenticate_42/?code=${totpCode}`;
		})
	}
	if (loginbtn) {
		loginbtn.addEventListener('submit', function(event) {
			event.preventDefault();
			 $.ajax({
			 	type: 'POST',
			 	url: 'login/',
			 	data: {'username': document.getElementById('id_username').value,
			 			'password': document.getElementById('id_password').value,
			 			'totp_code': document.getElementById('totp_code').value,
			 			csrfmiddlewaretoken: csrf_token},
			 	dataType: 'json',
			 	success: function(response) {
			 		if (response.success) {
			 			fetchNewCSRFToken();
			 			fetchNewjwtToken(document.getElementById('id_username').value, document.getElementById('id_password').value);
			 			gameSocket.send(JSON.stringify({
			 				'type': "login", 'jwtToken': getCookie("access")
			 			}));
			 			document.getElementById('loginForm').reset();
			 			redirHome();
			 		} else {
			 			showAlert('Login error : ' + response.message, 'danger')
			 			document.getElementById('id_password').value = null;
			 			document.getElementById('id_password').placeholder = response.message;
			 		}
			 	},
			 	error: function(error) {
			 		console.error('Error:', error);
			 	},
			 });
		});
	}
}