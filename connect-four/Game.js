class Game {
  element = null;
  positions = [];
  gameStarted = false;
  activePlayer = null;
  boardRows = 6;
  boardCols = 7;
  
  constructor(props) {
    const { element, onActivePlayerChange, onWinnerFound } = props;
    this.element = element;
    this.onActivePlayerChange = onActivePlayerChange;
    this.onWinnerFound = onWinnerFound;

    this.activePlayer = Math.random() > "0.5" ? "red": "yellow";
    this.triggerEvent("activePlayer");
    this.drawBoard();
    this.gameStarted = true;
  }

  triggerEvent = (event, ...restParams) => {
    switch(event) {
      case "activePlayer":
        if (this.onActivePlayerChange) {
          this.onActivePlayerChange(this.activePlayer);
        }
        break;
      case "winner":
        if (this.onWinnerFound) {
          this.onWinnerFound(event, ...restParams);
        }
        break;
    }
  }

  drawBoard = () => {
    for(let rowIndex = 0; rowIndex < this.boardRows; rowIndex++) {
      this.positions[rowIndex] = [];

      let row = document.createElement("div");
      row.classList.add("row");

      for(let colIndex = 0; colIndex < this.boardCols; colIndex++) {
        this.positions[rowIndex][colIndex] = null;

        const newDiv = document.createElement("div");
        newDiv.id = `square-${colIndex}-${rowIndex}`
        newDiv.classList.add("square");

        const circle = document.createElement("div");
        circle.classList.add("circle");
        newDiv.append(circle);
        
        newDiv.onclick = (e) => {
          this.playMove(colIndex);
        }

        row.append(newDiv);
      }

      this.element.append(row);
    }
  }

  playMove = (col) => {
    if (!this.gameStarted) {
      return;
    }

    for(let row = this.boardRows -1; row > -1; row--) {
      if (this.positions[row][col]){
        continue;
      }

      this.positions[row][col] = this.activePlayer;
      const square = document.getElementById(`square-${col}-${row}`);
      square.firstChild.classList.add(this.activePlayer);

      this.checkForWinner(col, row);

      this.activePlayer = this.activePlayer === "yellow" ? "red" : "yellow";
      this.triggerEvent("activePlayer");
      break;
    }
  }

  checkForWinner = (col, row) => {
    let activeDirections = 8;

    const directions = {
      N: {move: [-1, 0], moves: [[col, row]], canContinue: true},
      NE: {move: [-1, 1], moves: [[col, row]], canContinue: true},
      E: {move: [1, 0], moves: [[col, row]], canContinue: true},
      SE: {move: [1, 1], moves: [[col, row]], canContinue: true},
      S: {move: [0, 1], moves: [[col, row]], canContinue: true},
      SW: {move: [-1,1], moves: [[col, row]], canContinue: true},
      W: {move: [-1, 0], moves: [[col, row]], canContinue: true},
      NW: {move: [-1, -1], moves: [[col, row]], canContinue: true},
    }

    while(activeDirections !== 0) {
      Object.keys(directions).forEach(direction => {
        const { canContinue, move, moves } = directions[direction];
        if (!canContinue) return;
        
        const lastMove = moves[moves.length -1];

        // if ([...lastMove].includes(0)) {
        //   console.log(direction, "can no longer continue")
        //   directions[direction].canContinue = false;
        //   activeDirections -= 1;
        //   return;
        // }

        const nextMove = [lastMove[0] + move[0], lastMove[1] + move[1]]
        
        const nextValue = this.positions[nextMove[1]] && this.positions[nextMove[1]][nextMove[0]];

        if (nextValue === this.activePlayer) {
          directions[direction].moves.push(nextMove);
          if (directions[direction].moves.length === 4) {
            this.triggerEvent("winner", this.activePlayer, direction, moves)
            this.gameStarted = false;
          }
          return;
        } 

        directions[direction].canContinue = false;
        activeDirections -= 1;
      });
    }
  }
}