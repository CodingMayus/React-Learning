import { useState } from "react";

function Board({ isXnext, squares, onPlay }) {
  function handleClick(i) {
    //check if already moved here or already won
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    //why is the i not in braces compared to the square functions?
    //i assume its because if its brackets i brackets , its an object and thus cannot be used as
    //indices of teh array.
    //or could be something to do with JSX
    const newSquares = squares.slice();

    if (isXnext) {
      newSquares[i] = "X";
    } else {
      newSquares[i] = "O";
    }
    onPlay(newSquares);
    //or
  }
  // const [squares,setSquares]=useStates(Arrays(9).fill(null));

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (isXnext ? "X" : "O");
  }

  return (
    <>
      <div className="status"> {status}</div>
      <div class="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div class="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div class="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    </>
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
  //ways to win
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export default function Game() {
  //to add a history of the past games I need to be able to communicate between the different
  //states of the board.  For these different boards to communicate with each other -
  // we introduce a higher-level component to allow for easy communication between children.
  const [history, setHistory] = useState([
    [null, null, null, null, null, null, null, null, null],
  ]);
  const [currentMove, setCurrentMove]=useState(0);
  const currentSquares = history[currentMove];
  const isXnext = currentMove%2===0;
  // ol --> ordered list and making room for the game information
  // for list keys - normally its never good to have an increasing array index as the key as the list can rearranged and some elements could be added or deleted..  In this case as a list of previous moves it is perfectly fine.
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //is it even? if true then X is next, as X starts at move index 0.
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key = {move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function handlePlay(nextSquares) {
//currentMove + 1 as the end is not included in the range so to include Currentmove its gotta be +1.

const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
    //note that since we are not updating the board in the board component anymore
    //we have to do it in the higher level compoent: the game.
    //Here, [...history, nextSquares] creates a new array that contains all the items in history, followed by nextSquares.
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            isXnext={isXnext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
