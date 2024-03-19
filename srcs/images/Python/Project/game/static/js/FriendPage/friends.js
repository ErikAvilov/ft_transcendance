import { handle_token, check_token } from "../jwt.js";

export async function attachListListener() {
	const remove_btn = document.getElementsByClassName("id_list");
	const visit_btn = document.getElementsByClassName('card-title profiles');
	const row = document.getElementsByClassName("card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center - friends");
	const account_back_btn = document.getElementById('account_back_btn');
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
	if (account_back_btn) {
		account_back_btn.addEventListener('click', async function() {
			history.back();
		})
	}
}

function visitProfile(id){
	window.location.hash = '#profile_page/' + id;
}

function removeFriend(id){
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