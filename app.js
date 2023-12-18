const rects = document.querySelectorAll("g#boardgroup g"); // 19 * 19 intersection
// console.log(rects);
import { whiteStone, blackStone } from "./players.js";
import { ObjectSet } from "./set.js";

// WHite Capture + Black Capture
let whiteCaputre = 0;
let blackCaputre = 0;

const BOARD_SIZE = 19;
const board = new Array(BOARD_SIZE).fill(0).map(() => new Array(19).fill(0)); // Outer array contain Inner array

board[9][9] = 1;     // mesh3aref eh lazmethom ?
board[10][9] = 2;

let gameOver = false;
// let player = 0;
// let AI = 1;                        // msh mosta5dameen

let playerPiece = 1;
let AIPiece = 2;

rects.forEach((rect) => {
  // لما بدوس عالintersection ,, بيحطلي وايت ستون مكانها و يخليها مش متاحة للعب فيها تاني خلاص
  rect.addEventListener("click", () => {
    if (!rect.classList.contains("active") && !gameOver) {
      rect.innerHTML += whiteStone;
      rect.classList.add("active");
      draw(parseInt(rect.firstElementChild.id));
    }
  });
});


// Done
const draw = (id) => {
  const i = Math.floor(id / 19); // row
  const j = id % 19; // column
  // console.log(j);
  board[i][j] = playerPiece; // convert from 1 to playerPiece
  if (checkWhereToCapture(board, i, j, playerPiece)) {
    for (const [row, col] of checkWhereToCapture(board, i, j, playerPiece)) {
      // row , col that will remove & will be active again
      board[row][col] = 0;
      const ID = row * 19 + col;
      const block = document.getElementById(ID).parentElement;
      block.removeChild(block.lastElementChild);
      block.classList.remove("active");

      // Start Capture Handling
      whiteCaputre++;
      document.querySelector(".whiteCounter span").innerHTML = whiteCaputre;
      setTimeout(() => {
        if (whiteCaputre === 10) {
          alert("White Wons!");
          gameOver = true;
        }
      }, 50);
      // End Capture Handling
    }
  }

  //Check if white has won
  setTimeout(() => {
    if (isWinner(board, playerPiece)) {
      alert("You won!");
      gameOver = true;
    }
  }, 50);

  let nextMove = bestMove(board);

  board[nextMove.row][nextMove.col] = 2; // HERE , we will applly minimax algo

  if (checkWhereToCapture(board, nextMove.row, nextMove.col, AIPiece)) {
    for (const [i, j] of checkWhereToCapture(
      board,
      nextMove.row,
      nextMove.col,
      AIPiece
    )) {
      board[i][j] = 0;
      const ID = i * 19 + j;
      const block = document.getElementById(ID).parentElement;
      block.removeChild(block.lastElementChild);
      block.classList.remove("active");
      // Start Capture Handling
      blackCaputre++;
      document.querySelector(".blackCounter span").innerHTML = blackCaputre;
      setTimeout(() => {
        if (blackCaputre === 10) {
          alert("Black Wons!");
          gameOver = true;
        }
      }, 50);
      // End Capture Handling
    }
  }

  if (!gameOver) {
    const newID = nextMove.row * 19 + nextMove.col; // intersection number
    // console.log(newID);
    const block = document.getElementById(newID).parentElement;
    block.innerHTML += blackStone;
    block.classList.add("active");
  }

  //Check if black has won
  setTimeout(() => {
    if (isWinner(board, AIPiece)) {
      alert("Black has won!");
      gameOver = true;
    }
  }, 50);
};

// Done
const bestMove = (board) => {
  let validLocations = getValidLocations(board); // return cells of 0 (Valid Locations)
  // console.log("validLocation Length" , validLocations );
  let randomLocation = Math.floor(Math.random() * validLocations.length);
  let bestMove = validLocations[randomLocation];
  let bestScore = 0;
  let newState = createCopy(board);
  let score;
  // let captured = false;

  for (const { row, col } of validLocations) {
    newState[row][col] = AIPiece;
    score = scoring(newState, AIPiece);
    newState[row][col] = 0;
    if (score > bestScore) {
      bestScore = score;
      bestMove = { row: row, col: col };
    }
  }

  return bestMove;
};

// Done
const getValidLocations = (board) => {
  let validLocations = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0 /*valid*/ && hasAdjancentStone(board, i, j)) {
        validLocations.push({ row: i, col: j });
      }
    }
  }
  return validLocations;
};

// Done
const hasAdjancentStone = (board, row, col) => {
  const directions = [
    [-1, 0], //UP
    [1, 0], //DOWN
    [0, 1], //Right
    [0, -1], //Left
    [-1, 1], //UP Right
    [-1, -1], //Up Left
    [1, 1], //Down Right
    [1, -1], //Down Left
  ];

  for (const [i, j] of directions) {
    const newRow = row + i;
    const newCol = col + j;

    if (
      newRow >= 0 &&
      newRow < BOARD_SIZE &&
      newCol >= 0 &&
      newCol < BOARD_SIZE
    ) {
      if (board[newRow][newCol] !== 0) {
        return true;
      }
    }
  }
  return false;
};

// Done
const isWinner = (board, piece) => {
  //Check horizontally
  for (let j = 0; j < BOARD_SIZE - 4; j++) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (
        board[i][j] === piece &&
        board[i][j + 1] === piece &&
        board[i][j + 2] === piece &&
        board[i][j + 3] === piece &&
        board[i][j + 4] === piece
      ) {
        return true;
      }
    }
  }

  //Check Vertically
  for (let j = 0; j < BOARD_SIZE; j++) {
    for (let i = 0; i < BOARD_SIZE - 4; i++) {
      if (
        board[i][j] === piece &&
        board[i + 1][j] === piece &&
        board[i + 2][j] === piece &&
        board[i + 3][j] === piece &&
        board[i + 4][j] === piece
      ) {
        return true;
      }
    }
  }

  //Check Postive Sloped
  for (let j = 0; j < BOARD_SIZE - 4; j++) {
    for (let i = 0; i < BOARD_SIZE - 4; i++) {
      if (
        board[i][j] === piece &&
        board[i + 1][j + 1] === piece &&
        board[i + 2][j + 2] === piece &&
        board[i + 3][j + 3] === piece &&
        board[i + 4][j + 4] === piece
      ) {
        return true;
      }
    }
  }

  //Check Negative Sloped
  for (let j = 0; j < BOARD_SIZE - 4; j++) {
    for (let i = 4; i < BOARD_SIZE; i++) {
      if (
        board[i][j] === piece &&
        board[i - 1][j + 1] === piece &&
        board[i - 2][j + 2] === piece &&
        board[i - 3][j + 3] === piece &&
        board[i - 4][j + 4] === piece
      ) {
        return true;
      }
    }
  }
};

// Done
const checkWhereToCapture = (board, i, j, piece) => {
  //
  // console.log("i " , i);
  // console.log("j " , j);
  // console.log("piece " , piece);

  let oppentPiece = piece === AIPiece ? playerPiece : AIPiece;
  // console.log("oppentPiece " , oppentPiece);

  //Right
  if (
    j + 3 < BOARD_SIZE &&
    board[i][j + 1] === oppentPiece &&
    board[i][j + 2] === oppentPiece &&
    board[i][j + 3] === piece
  ) {
    return [
      [i, j + 1],
      [i, j + 2],
    ];
  }

  //Left
  if (
    j - 3 >= 0 &&
    board[i][j - 1] === oppentPiece &&
    board[i][j - 2] === oppentPiece &&
    board[i][j - 3] === piece
  ) {
    return [
      [i, j - 1],
      [i, j - 2],
    ];
  }

  //Up
  if (
    i - 3 >= 0 &&
    board[i - 1][j] === oppentPiece &&
    board[i - 2][j] === oppentPiece &&
    board[i - 3][j] === piece
  ) {
    return [
      [i - 1, j],
      [i - 2, j],
    ];
  }

  //Down
  if (
    i + 3 < BOARD_SIZE &&
    board[i + 1][j] === oppentPiece &&
    board[i + 2][j] === oppentPiece &&
    board[i + 3][j] === piece
  ) {
    return [
      [i + 1, j],
      [i + 2, j],
    ];
  }

  //Up Right
  if (
    i - 3 >= 0 &&
    j + 3 < BOARD_SIZE &&
    board[i - 1][j + 1] === oppentPiece &&
    board[i - 2][j + 2] === oppentPiece &&
    board[i - 3][j + 3] === piece
  ) {
    return [
      [i - 1, j + 1],
      [i - 2, j + 2],
    ];
  }

  //Up Left
  if (
    i - 3 >= 0 &&
    j - 3 >= 0 &&
    board[i - 1][j - 1] === oppentPiece &&
    board[i - 2][j - 2] === oppentPiece &&
    board[i - 3][j - 3] === piece
  ) {
    return [
      [i - 1, j - 1],
      [i - 2, j - 2],
    ];
  }

  //Down Right
  if (
    i + 3 < BOARD_SIZE &&
    j + 3 < BOARD_SIZE &&
    board[i + 1][j + 1] === oppentPiece &&
    board[i + 2][j + 2] === oppentPiece &&
    board[i + 3][j + 3] === piece
  ) {
    return [
      [i + 1, j + 1],
      [i + 2, j + 2],
    ];
  }
  //Down Left
  if (
    i + 3 < BOARD_SIZE &&
    j - 3 >= 0 &&
    board[i + 1][j - 1] === oppentPiece &&
    board[i + 2][j - 2] === oppentPiece &&
    board[i + 3][j - 3] === piece
  ) {
    return [
      [i + 1, j - 1],
      [i + 2, j - 2],
    ];
  }

  return false;
};

// Done
const createCopy = (board) => {
  let newBoard = [...board.map((cols) => [...cols])];
  return newBoard;
};

const blocking = (subset, piece, factor) => {
  let oppentPiece = piece === AIPiece ? playerPiece : AIPiece;
  let i = subset.indexOf(piece); // First occurence of a piece
  if (factor === 3) {
    if (
      i + 3 <= subset.length &&
      subset[i + 1] === oppentPiece &&
      subset[i + 2] === oppentPiece &&
      subset[i + 3] === oppentPiece
    ) {
      return true;
    }
  } else {
    if (
      i + 4 <= subset.length &&
      subset[i + 1] === oppentPiece &&
      subset[i + 2] === oppentPiece &&
      subset[i + 3] === oppentPiece &&
      subset[i + 4] === piece
    ) {
      console.log("losssing");
      return true;
    }
  }
  return false;
};

const evaluateConnection = (count) => {
  let score = 0;

  return score;
};

//  Explain
const scoring = (board, currentPiece) => {
  let oppentPiece = currentPiece === AIPiece ? playerPiece : AIPiece;
  //Check Horizontal
  let score = 0;
  let captured = false;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 4; j++) {
      let col = board[i].slice(j, j + 5); // The subset is has max length of 5

      let stoneCount = col.filter((piece) => piece === currentPiece).length;
      let OppentStoneCount = col.filter(
        (piece) => piece === oppentPiece
      ).length;
      let emptySpaceCount = col.filter((piece) => piece === 0).length;

      if (stoneCount === 5) {
        score += 1000;
      } else if (OppentStoneCount === 4 && stoneCount === 1) {
        score += 500;
      } else if (stoneCount === 4 && emptySpaceCount === 1) {
        score += 180;
      } else if (
        OppentStoneCount === 3 &&
        stoneCount === 1 &&
        emptySpaceCount === 1
      ) {
        score += 100;
      } else if (isCapture(col, currentPiece)) {
        score += 70;
        // captured = true;
      } else if (stoneCount === 3 && emptySpaceCount === 2) {
        score += 10;
      }
    }
  }

  //Check Vertical
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 4; j++) {
      let row = board.map((row) => row[i]);
      row = row.slice(j, j + 5); // The subset is has max length of 5

      let stoneCount = row.filter((piece) => piece === currentPiece).length;
      let OppentStoneCount = row.filter(
        (piece) => piece === oppentPiece
      ).length;
      let emptySpaceCount = row.filter((piece) => piece === 0).length;

      if (stoneCount === 5) {
        score += 1000;
      } else if (OppentStoneCount === 4 && stoneCount === 1) {
        score += 350;
      } else if (stoneCount === 4 && emptySpaceCount === 1) {
        score += 80;
      } else if (
        OppentStoneCount === 3 &&
        stoneCount === 1 &&
        emptySpaceCount === 1
      ) {
        score += 68;
      } else if (isCapture(row, currentPiece)) {
        score += 50;
        captured = true;
      } else if (stoneCount === 3 && emptySpaceCount === 2) {
        score += 10;
      }
    }
  }

  //Postive Slope
  for (let i = 0; i < BOARD_SIZE - 4; i++) {
    for (let j = 0; j < BOARD_SIZE - 4; j++) {
      let subset = [];
      for (let k = 0; k < 5; k++) {
        subset.push(board[i + k][j + k]);
      }
      let stoneCount = subset.filter((piece) => piece === currentPiece).length;
      let OppentStoneCount = subset.filter(
        (piece) => piece === oppentPiece
      ).length;
      let emptySpaceCount = subset.filter((piece) => piece === 0).length;

      if (stoneCount === 5) {
        score += 1000;
      } else if (OppentStoneCount === 4 && stoneCount === 1) {
        score += 350;
      } else if (stoneCount === 4 && emptySpaceCount === 1) {
        score += 80;
      } else if (
        OppentStoneCount === 3 &&
        stoneCount === 1 &&
        emptySpaceCount === 1
      ) {
        score += 68;
      } else if (isCapture(subset, currentPiece)) {
        score += 50;
        captured = true;
      } else if (stoneCount === 3 && emptySpaceCount === 2) {
        score += 10;
      }
    }
  }

  //Negative Slope
  for (let i = 4; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 4; j++) {
      let subset = [];
      for (let k = 0; k < 5; k++) {
        subset.push(board[i - k][j + k]);
      }

      let stoneCount = subset.filter((piece) => piece === currentPiece).length;
      let OppentStoneCount = subset.filter(
        (piece) => piece === oppentPiece
      ).length;
      let emptySpaceCount = subset.filter((piece) => piece === 0).length;

      if (stoneCount === 5) {
        score += 1000;
      } else if (OppentStoneCount === 4 && stoneCount === 1) {
        score += 350;
      } else if (stoneCount === 4 && emptySpaceCount === 1) {
        score += 80;
      } else if (
        OppentStoneCount === 3 &&
        stoneCount === 1 &&
        emptySpaceCount === 1
      ) {
        score += 68;
      } else if (isCapture(subset, currentPiece)) {
        score += 50;
        captured = true;
      } else if (stoneCount === 3 && emptySpaceCount === 2) {
        score += 10;
      }
    }
  }
  return score;
};

// Explain
const isCapture = (subset, piece) => {
  // console.log( "subset : " ,subset );
  let oppentPiece = piece === AIPiece ? playerPiece : AIPiece;
  let i = subset.indexOf(piece); // First occurence of a piece
  if (
    i + 3 <= subset.length &&
    subset[i + 1] === oppentPiece &&
    subset[i + 2] === oppentPiece &&
    subset[i + 3] === piece
  ) {
    console.log(true);
    return true;
  }
  return false;
};

// Explain
const minimax = (board, depth, isMaxmizingPlayer, alpha, beta) => {
  // let oppentPiece = piece === AIPiece ? playerPiece : AIPiece;
  if (isWinner(board, AIPiece)) {
    return [10000, null];
  } else if (isWinner(board, playerPiece)) {
    return [-10000, null];
  } else if (depth === 0) {
    return [scoring(board, AIPiece), null];
  }

  if (isMaxmizingPlayer) {
    //Max player turn
    let bestScore = -Infinity;
    let newState = createCopy(board);
    let validLocations = getValidLocations(newState);
    let bestMove =
      validLocations[Math.floor(Math.random() * validLocations.length)];

    //for each possible move (each child)
    for (const { row, col } of validLocations) {
      newState[row][col] = AIPiece;
      let score = minimax(newState, depth - 1, !isMaxmizingPlayer)[0];
      newState[row][col] = 0;

      if (score > bestScore) {
        bestScore = score;
        bestMove = { row: row, col: col };
      }

      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break;
      }
    }
    return [bestScore, bestMove];
  } else {
    //Min player turn
    let bestScore = Infinity;
    let newState = createCopy(board);
    let validLocations = getValidLocations(newState);
    let bestMove =
      validLocations[Math.floor(Math.random() * validLocations.length)];

    //for each possible move (each child)
    for (const { row, col } of validLocations) {
      newState[row][col] = playerPiece;
      let score = minimax(newState, depth - 1, !isMaxmizingPlayer)[0];
      newState[row][col] = 0;

      if (score < bestScore) {
        bestScore = score;
        bestMove = { row: row, col: col };
      }

      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break;
      }
    }
    return [bestScore, bestMove];
  }
};
