import { handle_token, check_token } from "./jwt.js";

export async function attachListListener()
{
	const remove_btn = document.getElementsByClassName("id_list");
	const visit_btn = document.getElementsByClassName('card-title profiles');
	const row = document.getElementsByClassName("card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center - friends");
	if (remove_btn)
	{
		for (let i = 0; i < remove_btn.length; i++) {
			remove_btn[i].addEventListener('click', function() {
				row[i].style.display = 'none';
				removeFriend(remove_btn[i].value);
			});
		};
	}
	if (visit_btn)
	{
		for (let i = 0; i < visit_btn.length; i++) {
			visit_btn[i].addEventListener('click', function() {
				var user_id = visit_btn[i].getAttribute('value');
				visitProfile(user_id);
			});
		};
	}
}

async function visitProfile(id){
	window.location.hash = '#profile_page/' + id;
}

export async function attachVisitHistoryListener(id) {
	const history_btn = document.getElementById("game_history_btn");
	if (history_btn) {
		history_btn.addEventListener('click', async function() {
			window.location.hash = '#game_history/' + id;
		});
	}
}

async function removeFriend(id){
	var payload = {
		csrfmiddlewaretoken: csrf_token,
		"id": id,
	}
	if (check_token())
	{
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'friend_remove/',
			timeout: 5000,
			data: payload,
			beforeSend: function(request) {
				handle_token(request);
			},
			success: function(data) {
				showAlert(data['response'], 'success');
				if(data['response'] == "Successfully removed that friend."){}
				else if(data['response'] != null){}
			},
			error: function(data) {
				showAlert("Something went wrong.", 'danger');
				console.error("ERROR...", data)
			},
		});
	}
}

export async function attachAcceptListeners() {
	const accept_btn = document.getElementsByClassName("confirm-friend-request material-icons p-1");
	const row = document.getElementsByClassName("card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center");
	if (accept_btn) {
		for (let i = 0; i < accept_btn.length; i++) {
			accept_btn[i].addEventListener('click', function() {
				row[i].style.display = 'none';
				acceptFriendRequest(accept_btn[i].value);
			});
		};
	}
}

export async function attachDeclineListeners() {
	const decline_btn = document.getElementsByClassName("decline-friend-request p-1");
	const row = document.getElementsByClassName("card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center");
	if (decline_btn) {
		for (let i = 0; i < decline_btn.length; i++) {
			decline_btn[i].addEventListener('click', function() {
				row[i].style.display = 'none';
				declineFriendRequest(decline_btn[i].value);
			});
		};
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
				if(data['response'] == "Friend request accepted."){
					// ui is updated
				}
				else if(data['response'] != null){
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
				if(data['response'] == "Friend request declined."){
					showAlert(data['response'], 'success');
				}
				else if(data['response'] != null){
				}
			},
			error: function(data) {
				showAlert('something went wrong', 'danger');
				console.error("ERROR...", data)
			},
		});
	}
}