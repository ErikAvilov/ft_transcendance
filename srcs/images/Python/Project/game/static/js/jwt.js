import {gameSocket} from "./game-physics.js"

export function check_token()
{
	if (getCookie("access") == "" && getCookie("refresh") == "")
		return false;
	if (getCookie("refresh") == "" || parseJwt(getCookie("refresh")).exp * 1000 <=  new Date().getTime() + 10 * 60 * 1000)
	{
		setCookie("access", "", 0);
		setCookie("refresh", "", 0);
		displayLoginPage();
		return false;
	}
	else if (getCookie("access") == "" || parseJwt(getCookie("access")).exp * 1000 <=  new Date().getTime() + 10 * 60 * 1000)
		refreshJWT();
	return true;
}

export function handle_token(request)
{
	if (getCookie("access") != "")
    	request.setRequestHeader("Authorization", "Bearer " + getCookie("access"));
}

export function fetchNewjwtToken(user, password) {
    $.ajax({
        type: 'POST',
        url: 'api/token/',
        dataType: 'json',
		async: false,
        headers : "Content-Type : application/json",
        data: {
			"username": user, 
			"password": password, 
			"csrfmiddlewaretoken": csrf_token
		},
        success: function(response) {
            jwt_token = response.access;
            jwt_refresh = response.refresh;
			let parsedaccess = parseJwt(jwt_token);
			let parsedrefresh = parseJwt(jwt_refresh);
			let parsedExpDateAccess = new Date(parsedaccess.exp * 1000).toUTCString();
			let parsedExpDateRefresh = new Date(parsedrefresh.exp * 1000).toUTCString();
			document.cookie = "access=" + response.access + "; expires=" + parsedExpDateAccess;
			document.cookie = "refresh=" + response.refresh + "; expires=" + parsedExpDateRefresh;
        },
        error: function(error) {
            console.error('Error fetching Jwt token:', error);
        }
    });
}

export function refreshJWT() {
    $.ajax({
        type: 'POST',
        url: 'api/token/refresh/',
        dataType: 'json',
		async: false,
        headers : "Content-Type : application/json",
        data: {"refresh": getCookie("refresh"), csrfmiddlewaretoken: csrf_token},
        success: function(response) {
			let parsedaccess = parseJwt(response.access);
			let parsedExpDateAccess = new Date(parsedaccess.exp * 1000).toUTCString();
			document.cookie = "access=" + response.access + "; expires=" + parsedExpDateAccess;
        },
        error: function(error) {
            console.error('Error fetching new Jwt token:', error);
        }
	});
}


export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
    }
}
return "";
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

let x = document.cookie;