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

	// Initialize the game with two players and reset the board
	function initializeGame() {
		player1 = player('Alice', 'X');
		player2 = player('Bob', 'O');
		currentPlayer = player1;
		gameBoard.resetBoard();
	}

	// Switch to the next player
	function switchPlayer() {
		currentPlayer = currentPlayer === player1 ? player2 : player1;
	}

	// Make a move on the board
	function makeMove(row, col) {
		if (gameBoard.getCell(row, col) === '') {
			gameBoard.setMarker(row, col, currentPlayer.getMarker());
			if (checkWin()) {
				console.log(`${currentPlayer.getName()} wins!`);
				gameBoard.printBoard();
				return;
			}
			if (checkDraw()) {
				console.log("It's a draw!");
				gameBoard.printBoard();
				return;
			}
			switchPlayer();
		} else {
			console.log('Cell is already occupied!');
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

	return {
		// Expose the initializeGame and makeMove functions
		initializeGame: initializeGame,
		makeMove: makeMove,
	};
})();

// Example usage:
gameController.initializeGame();
gameController.makeMove(0, 0); // Alice
gameController.makeMove(0, 1); // Bob
gameController.makeMove(1, 1); // Alice
gameController.makeMove(0, 2); // Bob
gameController.makeMove(2, 2); // Alice wins
