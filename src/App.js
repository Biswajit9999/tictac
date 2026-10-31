import { useState } from "react";
import "./App.css";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const calculateWinner = (board) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const handleClick = (index) => {
    // ignore clicks on filled cells or after the round has ended
    if (board[index] || winner || isDraw) return;

    const player = xIsNext ? "X" : "O";
    const nextBoard = [...board];
    nextBoard[index] = player;
    setBoard(nextBoard);

    const result = calculateWinner(nextBoard);

    if (result) {
      setWinner(result.player);
      setWinningCells(result.line);
      setScores((prev) => ({
        ...prev,
        [result.player]: prev[result.player] + 1,
      }));
    } else if (nextBoard.every(Boolean)) {
      setIsDraw(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const restartRound = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
  };

  const resetAll = () => {
    restartRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = `Turn: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Tic-Tac-Toe</h1>

        <div className="scores">
          <span className="score x">X: {scores.X}</span>
          <span className="score draws">Draws: {scores.draws}</span>
          <span className="score o">O: {scores.O}</span>
        </div>

        <p className="status">{status}</p>

        <div className="board">
          {board.map((value, index) => (
            <button
              key={index}
              type="button"
              className={`cell ${winningCells.includes(index) ? "win" : ""}`}
              onClick={() => handleClick(index)}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="btn primary" onClick={restartRound}>
            {winner ? "Play Again" : "Restart Round"}
          </button>
          <button type="button" className="btn secondary" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;