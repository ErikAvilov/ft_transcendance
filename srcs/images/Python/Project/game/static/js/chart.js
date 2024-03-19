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