import { handle_token, check_token } from "../jwt.js";

export async function attachRequestListeners() {
	const accept_btn = document.getElementsByClassName("confirm-friend-request material-icons p-1");
	const decline_btn = document.getElementsByClassName("decline-friend-request p-1");
	const row = document.getElementsByClassName("card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center");
	const account_back_btn = document.getElementById('account_back_btn');
	if (accept_btn) {
		for (let i = 0; i < accept_btn.length; i++) {
			accept_btn[i].addEventListener('click', function() {
				row[i].style.display = 'none';
				acceptFriendRequest(accept_btn[i].value);
			});
		};
	}
	if (decline_btn) {
		for (let i = 0; i < decline_btn.length; i++) {
			decline_btn[i].addEventListener('click', function() {
				row[i].style.display = 'none';
				declineFriendRequest(decline_btn[i].value);
			});
		};
	}
	if (account_back_btn) {
		account_back_btn.addEventListener('click', async function() {
			history.back();
		})
	}
}

async function acceptFriendRequest(friend_request_id) {
	if (check_token())
	{
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: 'friend_request_accept/' + friend_request_id + '/',
			timeout: 5000,
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				showAlert(data['response'], 'success');
				if (data['response'] == "Friend request accepted.") {
					// ui is updated
				}
				else if (data['response'] != null){
					alert(data['response'])
				}
			},
			error: function(data) {
				showAlert('something went wrong', 'danger');
			},
		});
	}
}

async function declineFriendRequest(friend_request_id){
	if (check_token())
	{
		$.ajax({
			type: 'GET',
			dataType: "json",
			url: 'friend_request_decline/' + friend_request_id + '/',
			timeout: 5000,
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				if (data['response'] == "Friend request declined.") {
					showAlert(data['response'], 'success');
				}
				else if (data['response'] != null) {
				}
			},
			error: function(data) {
				showAlert('something went wrong', 'danger');
				console.error("ERROR...", data)
			},
		});
	}
}