// gameBoard module using IIFE to create a singleton instance
const gameBoard = (function () {
	let rows = 3;
	let cols = 3;
	let board = [];

	// Initialize the board with empty strings
	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i][j] = '';
		}
	}

	return {
		// Get the current state of the board
		getBoard: function () {
			return board;
		},

		// Set a marker at a specific cell
		setMarker: function (row, col, value) {
			if (row >= 0 && row < rows && col >= 0 && col < cols) {
				board[row][col] = value;
			}
		},

		// Get the value of a specific cell
		getCell: function (row, col) {
			if (row >= 0 && row < rows && col >= 0 && col < cols) {
				return board[row][col];
			}
			return null;
		},

		// Print the board to the console
		printBoard: function () {
			for (let i = 0; i < rows; i++) {
				console.log(board[i].join(' | '));
				if (i < rows - 1) {
					console.log('---------');
				}
			}
		},

		// Reset the board to its initial state
		resetBoard: function () {
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					board[i][j] = '';
				}
			}
		},
	};
})();

// player factory function to create player objects
function player(name, marker) {
	return {
		// Get the player's name
		getName: function () {
			return name;
		},
		// Get the player's marker
		getMarker: function () {
			return marker;
		},
		// Set a new name for the player
		setName: function (newName) {
			name = newName;
		},
		// Set a new marker for the player
		setMarker: function (newMarker) {
			marker = newMarker;
		},
	};
}

// gameController module to handle game logic
const gameController = (function () {
	let player1, player2, currentPlayer;
	let gameOver = false;

	// Initialize the game with two players and reset the board
	function initializeGame() {
		const player1Name =
			document.getElementById('player1-name').value || 'Player 1';
		const player1Marker = document.getElementById('player1-marker').value;
		const player2Name =
			document.getElementById('player2-name').value || 'Player 2';
		const player2Marker = document.getElementById('player2-marker').value;

		if (player1Marker === player2Marker) {
			alert('Players must have different markers!');
			return;
		}
		player1 = player(player1Name, player1Marker);
		player2 = player(player2Name, player2Marker);
		currentPlayer = player1Marker === 'X' ? player1 : player2;
		gameBoard.resetBoard();
		displayController.updateBoard();
		displayController.updateCurrentTurn(currentPlayer.getName());
		gameOver = false;
	}

	// Switch to the next player
	function switchPlayer() {
		currentPlayer = currentPlayer === player1 ? player2 : player1;
		displayController.updateCurrentTurn(currentPlayer.getName());
	}

	// Make a move on the board
	function makeMove(row, col) {
		if (gameOver) {
			alert('The game is over. Please reset the game to play again.');
			return;
		}

		if (gameBoard.getCell(row, col) === '') {
			gameBoard.setMarker(row, col, currentPlayer.getMarker());
			displayController.updateBoard();
			if (checkWin()) {
				alert(`${currentPlayer.getName()} wins!`);
				gameOver = true;
				return;
			}
			if (checkDraw()) {
				alert("It's a draw!");
				gameOver = true;
				return;
			}
			switchPlayer();
		} else {
			alert('Cell is already occupied!');
		}
	}

	// Check if the current player has won
	function checkWin() {
		const board = gameBoard.getBoard();
		const marker = currentPlayer.getMarker();

		// Check rows
		for (let i = 0; i < 3; i++) {
			if (
				board[i][0] === marker &&
				board[i][1] === marker &&
				board[i][2] === marker
			) {
				return true;
			}
		}

		// Check columns
		for (let i = 0; i < 3; i++) {
			if (
				board[0][i] === marker &&
				board[1][i] === marker &&
				board[2][i] === marker
			) {
				return true;
			}
		}

		// Check diagonals
		if (
			(board[0][0] === marker &&
				board[1][1] === marker &&
				board[2][2] === marker) ||
			(board[0][2] === marker &&
				board[1][1] === marker &&
				board[2][0] === marker)
		) {
			return true;
		}

		return false;
	}

	// Check if the game is a draw
	function checkDraw() {
		let board = gameBoard.getBoard();
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === '') {
					return false;
				}
			}
		}
		return true;
	}

	// Reset the game completely
	function resetGame() {
		document.getElementById('player1-name').value = '';
		document.getElementById('player2-name').value = '';
		document.getElementById('player1-marker').value = 'X';
		document.getElementById('player2-marker').value = 'O';
		displayController.updateCurrentTurn(''); // Clear the current turn display
		gameBoard.resetBoard();
		displayController.updateBoard();
		gameOver = false;
	}

	return {
		// Expose the initializeGame, makeMove, and resetGame functions
		initializeGame: initializeGame,
		makeMove: makeMove,
		resetGame: resetGame,
	};
})();

// displayController module to handle DOM interactions
const displayController = (function () {
	const gameBoardElement = document.getElementById('game-board');
	const resetButton = document.getElementById('reset-button');
	const startGameButton = document.getElementById('start-game-button');
	const currentTurnElement = document.getElementById('current-turn');

	// Create the game board in the DOM
	function createBoard() {
		gameBoardElement.innerHTML = '';
		for (let i = 0; i < 3; i++) {
			const row = document.createElement('div');
			row.classList.add('row');
			for (let j = 0; j < 3; j++) {
				const cell = document.createElement('div');
				cell.classList.add('cell');
				cell.dataset.row = i;
				cell.dataset.col = j;
				cell.addEventListener('click', handleCellClick);
				row.appendChild(cell);
			}
			gameBoardElement.appendChild(row);
		}
	}

	// Handle cell click events
	function handleCellClick(event) {
		const row = event.target.dataset.row;
		const col = event.target.dataset.col;
		gameController.makeMove(row, col);
	}

	// Update the display of the game board
	function updateBoard() {
		const board = gameBoard.getBoard();
		const cells = document.querySelectorAll('.cell');
		cells.forEach(cell => {
			const row = cell.dataset.row;
			const col = cell.dataset.col;
			cell.textContent = board[row][col];
		});
	}

	// Update the display of the current player's turn
	function updateCurrentTurn(playerName) {
		currentTurnElement.textContent = playerName
			? `Current Turn: ${playerName}`
			: '';
	}

	// Initialize the display controller
	function initialize() {
		createBoard();
		resetButton.addEventListener('click', gameController.resetGame);
		startGameButton.addEventListener(
			'click',
			gameController.initializeGame
		);
	}

	return {
		initialize: initialize,
		updateBoard: updateBoard,
		updateCurrentTurn: updateCurrentTurn,
	};
})();

// Initialize the game and display controller
document.addEventListener('DOMContentLoaded', () => {
	displayController.initialize();
});
