const intialgrid = [
    ['N', 'N', 'N'],
    ['N', 'N', 'N'],
    ['N', 'N', 'N']
];

const players = [{name: 'X', coordinates: []}, {name: 'O', coordinates: []}];

// Print grid
const printGrid = (grid) => {
    console.log('-----------------------');
    grid.forEach((row)=>{  
        console.log(row[0], row[1], row[2]);
    });
    console.log('-----------------------');
}

const propmtPlayer = (player) => {
    console.log(`Enter the position of Player '${player}'`);
}

// Mark Player's choice on grid
const markElement = (grid, player, coordinate) => {
    const [row, col]= coordinate;
    // Check if the cell is filled or not, if filled proceed to evaluation
    if(grid[col][row] !== 'N') {
        return grid;
    }
    // If the cell is not filled, Mark the cell with the given coordinate and return new grid
    grid[row][col] = player.name;

    // Also, add to players coordinates;
    player.coordinates.push(coordinate);

    return grid;
}

getNextPlayer = (currentPlayer) => {
    nextPlayer = players.indexOf(currentPlayer) === 0 ? 1 :0;
    return players[nextPlayer];
}

const evaluateGame = async (grid) => {
    return new Promise((resolve, reject)=>{
         try {
            let result = {
                gameOver: false,
                status: '',
                winner: null,
            }

            // Check the grid for straight or diagonal lines of the same name
            let rowMatches = 0;
            let rowMatch = false, columnMatch = false, diagonalMatch = false;
            let winner;

            for (let g = 0; g < grid.length; g++) {
                
                // Row Match check 
                for (let i = 0, j=1; j < grid[g].length; j++) {
    
                    if (grid[g][i] === 'N' || grid[g][j] === 'N') { 
                        continue;
                    }  

                    if(grid[g][i] === grid[g][j]) {
                        rowMatches++;
                    }

                } 

                if(rowMatches === 2) {
                    winner = grid[g][0];
                    rowMatch = true;
                    break;
                }

                // Column Check
                if(grid[0][g] === grid[1][g] === grid[2][g]) {
                    columnMatch = true;
                    winner = grid[0][g];
                    break;
                } 

                // Diagonal Check
                let diagonalA = grid[0][0] === grid[1][1] === grid[2][2];
                let diagonalB = grid[0][2] === grid[1][1] === grid[2][0];

                if(diagonalA || diagonalB) {
                    diagonalMatch = true;
                    winner = diagonalA ? grid[0][0] : grid[0][2];
                    break;
                } 
            }

            // Check of matches and determine game status
            if(rowMatch || columnMatch || diagonalMatch) {
                // Game is over
                result.gameOver = true;
                result.status = 'WIN';
                result.winner = winner;
            }
        
            setTimeout(()=>{
                resolve(result);
            }, 3000);
            
         } catch (error) {
             reject(error);
         }
    });        
}



gameLoop = async ()=> {
    let nextGrid;
      // Intialize players and select the first player
    const random = Math.round(Math.random());
    const initialplayer = players[random];
    let nextPlayer;
    let gameOver = false;

    // Start the game
    let player1coordinates = [0,0];
    let player2coordinates = [2,2];
    
    while(!gameOver) {
        let result;
        if(!nextPlayer) {
            nextPlayer = initialplayer;
        }
        if(!nextGrid) {
            nextGrid = intialgrid;
        }
    
        printGrid(nextGrid);
        // Prompt first player
        propmtPlayer(nextPlayer.name);
       
        // Prompt for response and Mark on the grid
        nextGrid = markElement(nextGrid, nextPlayer, player1coordinates);
        result = await evaluateGame(nextGrid);


        if(result.gameOver === true) {
            gameOver = true;
            printGrid(nextGrid);
            console.log('*******************************');
            console.log(`WHOOO, Player ${result.winner} ${result.status}`);
            console.log('*******************************')
            return;
        } 
        if(player1coordinates[1] < 2) {
             player1coordinates[1] += 1;
        }
    }
}

gameLoop();

