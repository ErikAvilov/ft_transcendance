function showAlert(message, type) {
	const alertContainer = document.getElementById('alert-container');
	
	const alert = document.createElement('div');
	alert.className = `alert alert-${type} alert-dismissible fade show`;
	alert.role = 'alert';
	alert.innerHTML = `${message}
	  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  
	alertContainer.appendChild(alert);
  
	setTimeout(() => {
	  $(alert).fadeOut('slow', () => {
		alert.remove();
	  });
	}, 5000);
  }