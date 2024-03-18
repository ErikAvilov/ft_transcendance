import { gameSocket } from "./game-physics.js";

// document.getElementById('createTournamentForm').addEventListener('submit', function (e) {
// 	const size = document.getElementById('participantNumber').value;
// 	const password = document.getElementById('tournamentPassword').value;

// 	if (!size || !password) {
// 		alert("Tous les champs sont requis !");
// 		return;
// 	}
// 	const message = {
// 		type: 'createTournament',
// 		size: Number(size),
// 		password: password
// 	};
// 	gameSocket.send(JSON.stringify(message));
// });

$('#tournamentModal').on('show.bs.modal', function (e) {
	gameSocket.send(JSON.stringify({ type: "join_tournament_updates" }));
	gameSocket.send(JSON.stringify({ type: "request_tournament_list" }));
});

$('#tournamentModal').on('hide.bs.modal', function (e) {
	gameSocket.send(JSON.stringify({ type: "leave_tournament_updates" }));
});

export function updateTournamentListWithData(tournaments, page = 1) {
	const tableBody = $('#tournamentTable tbody');
	tableBody.empty();
	const sortedTournaments = tournaments.sort((a, b) => {
		const aCount = parseInt(a.completion.split('/')[0]);
		const bCount = parseInt(b.completion.split('/')[0]);
		return bCount - aCount;
	});

	const tournamentsPerPage = 10;
	const startIndex = (page - 1) * tournamentsPerPage;
	const endIndex = startIndex + tournamentsPerPage;
	const paginatedTournaments = sortedTournaments.slice(startIndex, endIndex);

	paginatedTournaments.forEach(tournament => {
		tableBody.append(`
            <tr>
                <td>${tournament.id}</td>
                <td>${tournament.host}</td>
                <td>${tournament.completion}</td>
                <td><button class="btn btn-primary join-tournament-btn" data-id="${tournament.id}">Join</button></td>
            </tr>
        `);
	});
}

// function updatePagination(totalTournaments, tournamentsPerPage, currentPage) {
// 	const pageCount = Math.ceil(totalTournaments / tournamentsPerPage);
// 	const paginationContainer = $('#pagination');
// 	paginationContainer.empty();

// 	for (let i = 1; i <= pageCount; i++) {
// 		const pageButton = $(`<button class="btn btn-sm btn-page">${i}</button>`);
// 		pageButton.click(() => updateTournamentList(i));
// 		if (i === currentPage) {
// 			pageButton.addClass('btn-primary');
// 		} else {
// 			pageButton.addClass('btn-secondary');
// 		}
// 		paginationContainer.append(pageButton);
// 	}
// }

$('#quitTournamentButton').on('click', function (e) {
	gameSocket.send(JSON.stringify({
		'type': 'quit_tournament',
	}));
});

$('#quickMatchButton').on('click', function (e) {
	gameSocket.send(JSON.stringify({
		'type': 'join_tournament',
		'id': -1,
		'password': 'quickmatch'
	}));
});

$(document).on('click', '.join-tournament-btn', function () {
	const tournamentId = String($(this).data('id'));
	const password = prompt("Please enter the tournament password:"); {
		gameSocket.send(JSON.stringify({
			type: "join_tournament",
			id: Number(tournamentId),
			password: password
		}))
	}
	gameSocket.send(JSON.stringify({ type: "request_tournament_list" }));
});

// $(document).ready(function () {
// 	updateTournamentList();
// });

$(document).ready(function () {
	function nextPowerOf2(n) {
		return n * 2;
	}

	function prevPowerOf2(n) {
		return n / 2;
	}

	$('#increment').click(function () {
		var currentVal = parseInt($('#participantNumber').val());
		var nextVal = nextPowerOf2(currentVal);
		if (nextVal <= 16) $('#participantNumber').val(nextPowerOf2(currentVal));
	});

	$('#decrement').click(function () {
		var currentVal = parseInt($('#participantNumber').val());
		var nextVal = prevPowerOf2(currentVal);
		if (nextVal >= 2) $('#participantNumber').val(nextVal);
	});
});

$(document).ready(function () {
	$('#createTournamentForm').on('submit', function (e) {
		function isPowerOfTwo(number) {
			return number > 1 && (number & (number - 1)) === 0;
		}
		function displayError(show) {
			if (show) {
				$('#participantNumber').addClass('is-invalid');
			} else {
				$('#participantNumber').removeClass('is-invalid');
			}
		}
		e.preventDefault();
		var size = parseInt($('#participantNumber').val(), 10);
		var password = $('#tournamentPasswordStr').val();
		if (!isPowerOfTwo(size)) {
			displayError(true);
			return;
		}
		displayError(false);
		const message = {
			type: 'createTournament',
			size: size,
			password: password
		};
		gameSocket.send(JSON.stringify(message));
		gameSocket.send(JSON.stringify({ type: "request_tournament_list" }));
	});
});