function gameBoard() {
	let rows = 3;
	let cols = 3;
	let board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < cols; j++) {
			board[i][j] = '';
		}
	}

	return {
		getBoard: function () {
			return board;
		},

		setMarker: function (row, col, value) {
			if (row >= 0 && row < rows && col >= 0 && col < cols) {
				board[row][col] = value;
			}
		},

		getCell: function (row, col) {
			if (row >= 0 && row < rows && col >= 0 && col < cols) {
				return board[row][col];
			}
			return null;
		},

		printBoard: function () {
			for (let i = 0; i < rows; i++) {
				console.log(board[i].join(' | '));
				if (i < rows - 1) {
					console.log('---------');
				}
			}
		},
	};
}

function player(name, marker) {
	return {
		getName: function () {
			return name;
		},
		getMarker: function () {
			return marker;
		},
		setName: function (newName) {
			name = newName;
		},
		setMarker: function (newMarker) {
			marker = newMarker;
		},
	};
}

// Example usage:
let player1 = player('Alice', 'X');
let player2 = player('Bob', 'O');

console.log(player1.getName()); // Alice
console.log(player1.getMarker()); // X

console.log(player2.getName()); // Bob
console.log(player2.getMarker()); // O
