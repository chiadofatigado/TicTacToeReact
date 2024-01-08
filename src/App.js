import { useState } from "react";

// Renders a single square
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Restarts the game
function Restart({ onRestart }) {
  return (
    <button className="restart" onClick={onRestart}>
      Restart
    </button>
  );
}

// Revert to previous move
function Revert({ onRevert }) {
  return (
    <button className="revert" onClick={onRevert}>
      Revert
    </button>
  );
}

// Renders the board and the status
function Board({ xIsNext, squares, onPlay, onRestart, onRevert }) {

  // This function is called when a square is clicked
  function handleClick(i) {
    // Ignore click if game is over or square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Create a copy of the squares array and update the copy with the new value at the clicked index (i)
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares); // Call the onPlay prop with the updated squares array
  }

  const winner = calculateWinner(squares); // Check if there is a winner
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }
  // If there is no winner and all squares are filled, it's a draw
  if (squares.every((x) => x !== null)) {// Check if all squares are filled
    status = "Draw!";
  }

  // This function is called for each square in the board
  // Render a single square
  function renderSquare(i) {
    return <Square value={squares[i]} onSquareClick={() => handleClick(i)} />;
  }

  // Function to render rows of squares (Creates the board)
  function renderBoard() {
    // Initialize the board array
    const board = [];

    // Loop to iterate over the squares array
    // For each iteration:
      // Create a row div
      // Render three squares per row by calling renderSquare
      // Add the row to the rows array
    for (let i = 0; i < squares.length; i += 3) {
      const row = (
        <div className="board-row">
          {renderSquare(i)}
          {renderSquare(i + 1)}
          {renderSquare(i + 2)}
        </div>
      );
      board.push(row);
    }
    return board;
  }

  return (
    <>
      <div className="status">{status}</div>
      <Restart onRestart={onRestart} />
      {onRevert && <Revert onRevert={onRevert} />}
      {renderBoard()}
    </>
  );
}

// Main component that Renders the game board and handles the game logic 
export default function Game() {
  // Initialize the history of plays, an array of arrays that contain the game state
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = (currentMove % 2) === 0;
  const currentSquares = history[currentMove];

  // This function is called when a square is clicked and updates the history state with the new squares array
  // It also updates the currentMove state to the last move in the history array
  // This function is passed as a prop to the Board component
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function revert() {
    setCurrentMove(currentMove - 1);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          onRestart={restart} 
          onRevert={currentMove > 0 ? revert : null} />
      </div>
      <div className="game-info">
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
