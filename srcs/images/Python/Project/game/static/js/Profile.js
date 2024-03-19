import { handle_token, check_token } from "./jwt.js";

export async function attachSettingsListeners() {
	const dynamicElement = document.getElementById('profile_submit');
	const tfa_toggle_btn = document.getElementById("tfa_toggle");
	const tfa_submit_btn = document.getElementById("first_tfa_submit");
	const account_back_btn = document.getElementById('account_back_btn');
    if (dynamicElement) {
        dynamicElement.addEventListener('submit', async function(event) {
            event.preventDefault();

            var formData = new FormData();
			var formDataTmp = {};

			$('#profile_submit').serializeArray().forEach(function(item) {
				formDataTmp[item.name] = item.value;
			});

			formData.append('email', formDataTmp['email']);
            formData.append('displayname', document.getElementById('id_name').value);
            formData.append('image', document.getElementById('id_profile_pic').files[0]);
            formData.append('csrfmiddlewaretoken', csrf_token);
			if (check_token())
			{
				$.ajax ({
					type: 'POST',
					url: 'saveProfileSettings/',
					data: formData,
					beforeSend: function(request) {
						handle_token(request);
					},
					processData: false,
					contentType: false,
					success: async function(response) {
						if (response.success) {
							window.location.hash = '#profile_page';
							showAlert('Profile updated', 'success');
						} else {
							showAlert('Profile update failed', 'danger');
						}
					},
				});
			}
        });
    }
	if (account_back_btn) {
		account_back_btn.addEventListener('click', async function() {
			history.back();
		})
	}
	if (tfa_toggle_btn) {
		tfa_toggle_btn.addEventListener('change', async function() {
			if (this.value == 'on')
				toggleTfa();
			else if (this.value == 'off')
				disableTfa();
		});
	}
	if (tfa_submit_btn) {
		tfa_submit_btn.addEventListener('click', async function() {
			if (check_token())
			{
				$.ajax({
					type: 'POST',
					url: 'validateTfa/',
					data: {'totp_code': document.getElementById('first_totp').value,
						csrfmiddlewaretoken: csrf_token},
					beforeSend: function(request) {
						handle_token(request);
					},
					success: async function(response) {
						if (response.success) {
							document.getElementById("2FA").style.display = 'none';
							window.location.hash = '#profile_page';
							showAlert('2FA enabled', 'success');
						} else {
							showAlert('Invalid TOTP code', 'danger');
						}
					},
				});
			}
		});
	}
}

async function toggleTfa() {
	if (check_token())
	{
		$.ajax({
			type: 'POST',
			url: 'toggleTfa/',
			data: {csrfmiddlewaretoken: csrf_token},
			beforeSend: function(request) {
				handle_token(request);
			},
			success: async function(response) {
				if (response.success) {
					document.getElementById("profile_fetch").style.display = 'none';
					document.getElementById("qrCodeContainer").innerHTML = "<img src=data:image/png;base64," + response.img + " alt='qr code'>"
					document.getElementById("secret_code").innerText = response.code;
					document.getElementById("2FA").style.display = 'block';
				} else {
				}
			},
		});
	}
}

async function disableTfa() {
	if (check_token())
	{
		$.ajax({
			type: 'POST',
			url: 'disableTfa/',
			data: {csrfmiddlewaretoken: csrf_token},
			beforeSend: function(request) {
				handle_token(request);
			},
			success: async function(response) {
				if (response.success) {
					showAlert('2FA disabled', 'success');
				} else {
				}
			},
		});
	}
}

export async function attachProfileListener() {
    const   game_history_btn = document.getElementById("game_history_btn");
	const   profile_btn = document.getElementById("profbtn");
	const	friend_search_btn = document.getElementById("friend_search_submit");
	const	friends_btn = document.getElementById("friend_request_list");
	const 	display_friends = document.getElementById('display_friend_list');
	if (friend_search_btn) {
		friend_search_btn.addEventListener('click', async function() {
			if (check_token())
			{
				$.ajax({
					type: 'GET',
					url: 'userExists/',
					data: {'username': document.getElementById('friend_search').value,
					csrfmiddlewaretoken: csrf_token},
					beforeSend: function(request) {
						handle_token(request);
					},
					success: async function(response) {
						if (response.success) {
							sendFriendRequest(response.id);
						} else {
							showAlert(response.message, 'danger');
							document.getElementById('w_request_sent').style.display = 'none';
							document.getElementById('w_request_error').style.display = 'block';
						}
					},
				})
			}
		});
	}
	if (game_history_btn)
		game_history_btn.addEventListener('click', async function() {
			window.location.hash = '#game_history';
	   })
	if (profile_btn)
		profile_btn.addEventListener('click', async function() {
			window.location.hash = '#profile_settings';
	})
	if (friends_btn) {
		friends_btn.addEventListener('click', async function() {
			window.location.hash = '#friend_requests';
		});
	}
	if (display_friends) {
		display_friends.addEventListener('click', async function() {
			window.location.hash = '#friend_list';
		});
	}
}

export async function attachHistoryListeners() {
	const	chartid = document.getElementById("chart1");
	const visit_btn = document.getElementsByClassName('card-title games');
	const	account_back_btn = document.getElementById('account_back_btn');
	if (chartid) {
		let ctx = chartid.getContext("2d");
		let myData = JSON.parse(document.getElementById("dataFromDjango").innerHTML);
		
		const games = document.getElementsByClassName("games card mb-3");
		if (ctx) {
			let chart1 = new Chart(ctx, {
				type: "doughnut",
				data: {
				labels: ["Losses", "Wins",],
				datasets: [
					{
						backgroundColor: ["red", "green"],
						borderColor: "#417690",
						data: myData
					}
				]
				},
				options: {
					title: {
						text: "Wins / Losses",
						display: true
					}
				}
			});
		}
	}
	if (visit_btn)
	{
		for (let i = 0; i < visit_btn.length; i++) {
			visit_btn[i].addEventListener('click', function() {
				var game_id = visit_btn[i].getAttribute('value');
				visitGame(game_id);
			});
		};
	}
	if (account_back_btn) {
		account_back_btn.addEventListener('click', async function() {
			history.back();
		})
	}
}

async function visitGame(id){
	window.location.hash = '#game_details/' + id;
}