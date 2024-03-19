export async function attachHistoryListeners() {
	const	chartid = document.getElementById("chart1");
	const	visit_btn = document.getElementsByClassName('card-title games');
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