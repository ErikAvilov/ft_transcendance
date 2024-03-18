import { handle_token, check_token } from "./jwt.js"

const   view_btn = document.getElementById("profview");

view_btn.addEventListener('click', async function() {
    window.location.hash = '#profile_page';
})

export async function attachEventListeners() {
    const dynamicElement = document.getElementById('profile_submit');
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
}

export async function attachBackBtnListener() {
	const account_back_btn = document.getElementById('account_back_btn');
	if (account_back_btn) {
		account_back_btn.addEventListener('click', async function() {
			history.back();
		})
	}
}

export function serveStatic() {
	
}

export async function attachTfaListener() {
	const tfa_toggle_btn = document.getElementById("tfa_toggle");
	const tfa_submit_btn = document.getElementById("first_tfa_submit");
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
					showAlert('2FA enabled', 'success');
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

export async function attachHistoryListener() {
    const   game_history_btn = document.getElementById("game_history_btn");
	const   profile_btn = document.getElementById("profbtn");
    if (game_history_btn)
        game_history_btn.addEventListener('click', async function() {
            window.location.hash = '#game_history';
        })
	if (profile_btn)
		profile_btn.addEventListener('click', async function() {
			window.location.hash = '#profile_settings';
		})
}
