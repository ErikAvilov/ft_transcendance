export async function attachRegListener() {
	const regform = document.getElementById("registerForm");
	if (regform) {
		regform.addEventListener('submit', async function(event) { // Registration
			event.preventDefault();
			 var formData = {};
			 $('#registerForm').serializeArray().forEach(function(item) {
			 	formData[item.name] = item.value;
			 });
			 formData['csrfmiddlewaretoken'] = csrf_token;
			 $.ajax({
			 	type: 'POST',
			 	url: 'register/',
			 	dataType: 'json',
			 	data: formData,
			 	success: function(response) {
			 		if (response.success) {
			 			showAlert('Succesfully registered !', 'success');
			 			document.getElementById('registerForm').reset();
			 			displayLoginPage();
			 		} else { 
			 			if (response.error == "User already exists")
			 				showAlert('Registration failed : ' + response.error, 'danger');
			 			else {
			 				showAlert('Registration failed : ' + response.error, 'danger');
			 				document.getElementById('register_password1').value = "";
			 				document.getElementById('register_password2').value = "";
			 				document.getElementById('register_password1').placeholder = response.error;
			 				document.getElementById('register_password2').placeholder = response.error;
			 			}
			 		}
			 	},
			 	error: function(error) {
			 		showAlert('Registration failed : ' + error, 'danger');
			 	},
			 });
		});
	}
}