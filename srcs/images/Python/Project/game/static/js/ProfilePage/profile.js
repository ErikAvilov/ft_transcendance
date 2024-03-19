import { handle_token, check_token } from "../jwt.js";

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

async function sendFriendRequest(id) {
	var payload = {
		csrfmiddlewaretoken: csrf_token,
		"id": id,
	}
	if (check_token())
	{
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: "friend_request/",
			timeout: 5000,
			data: payload,
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				showAlert(data['response'], 'success');
				if (data['response'] == "Friend request sent.") {
					document.getElementById('friend_search').value = '';
					document.getElementById('friend_search').placeholder = '🍻';
					document.getElementById('w_request_sent').style.display = 'block';
					document.getElementById('w_request_error').style.display = 'none';
				}
				else {
					document.getElementById('w_request_sent').style.display = 'none';
					document.getElementById('w_request_error').style.display = 'block';
				}
			},
			error: function(data) {
				showAlert("Something went wrong.", 'danger');
				alert("Something went wrong.")
			},
		});
	}
}
