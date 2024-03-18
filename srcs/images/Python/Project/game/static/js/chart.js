import { handle_token, check_token } from "./jwt.js";

export async function attachHistoryChartListener() {
	let chartid = document.getElementById("chart1");
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
}

export async function attachGameChartListener() {
	let chartid2 = document.getElementById("gameChart");
	if (chartid2) {
		let ctx2 = document.getElementById("gameChart").getContext("2d");
		let myData = JSON.parse(document.getElementById("dataFromDjangoGame").innerHTML);
		if (ctx2) {
			let gameChart = new Chart(ctx2, {
				type: "doughnut",
				data: {
				labels: ["Winner scored", "Loser scored", ],
				datasets: [
					{
						backgroundColor: ["green", "red"],
						borderColor: "#417690",
						data: myData
					}
				]
				},
				options: {
				title: {
					text: "Score",
					display: true
					}
				}
			});
		}
	}
}

export async function attachGameListListener()
{
	const visit_btn = document.getElementsByClassName('card-title games');
	if (visit_btn)
	{
		for (let i = 0; i < visit_btn.length; i++) {
			visit_btn[i].addEventListener('click', function() {
				var game_id = visit_btn[i].getAttribute('value');
				visitGame(game_id);
			});
		};
	}
}

async function visitGame(id){
	window.location.hash = '#game_details/' + id;
}