export async function attachVisitHistoryListener(id) {
	const history_btn = document.getElementById("game_history_btn");
	if (history_btn) {
		history_btn.addEventListener('click', async function() {
			window.location.hash = '#game_history/' + id;
			console.log(id)
		});
	}
}