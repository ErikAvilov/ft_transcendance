import { lang_switcher } from "./languages.js";
import { handle_token , check_token} from "./jwt.js";

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