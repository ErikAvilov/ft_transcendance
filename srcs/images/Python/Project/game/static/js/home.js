import { setCookie, check_token, handle_token } from "./jwt.js";
import { gameSocket } from "./game-physics.js";

export async function attachHomeListeners() {
	const logoutbtn = document.getElementById("logout");
	const view_btn = document.getElementById("profview");

	if (view_btn) {
		view_btn.addEventListener('click', async function() {
			window.location.hash = '#profile_page';
		})
	}
	if (logoutbtn) {
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
							window.location.hash = '#login';
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
							window.location.hash = '#login';
							console.error('Error logout :', error);
						},
					});
				}
		})
	}
}