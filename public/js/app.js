let socket = io();

const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const playerHdr = document.querySelector('.hdr-player');
const winnerHdr = document.querySelector('.hdr-winner');
const turnHdr = document.querySelector('.hdr-turn');
const board = document.querySelector('.brd');

var pn = 0;

clearBoard();

resetBtn.style.display = "none";
winnerHdr.style.display = "none";
turnHdr.style.display = "none";
board.style.display = "none";

startBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

resetBtn.addEventListener('click', () => {
    socket.emit('resetGame');
});

socket.on('resetGame', () => {
    resetGame();
});

socket.on('startGame', (data) => {
    startGame(data);
});

socket.on('spotChosen', (data) => {
    fillSpot(data);
});

socket.on('gameOver', (data) => {
    gameOver(data);
});

socket.on('catsGame', () => {
    catsGame();
});

function startGame(data) {
    startBtn.style.display = "none";
    resetBtn.style.display = "block";
    turnHdr.style.display = "block";
    turnHdr.innerHTML = "It is Player 1's turn";
    board.style.display = "table";
    pn = data["player_num"];
    playerHdr.innerHTML = "You are Player " + pn;
}

function resetGame() {
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
    board.style.display = "none";
    playerHdr.innerHTML = "whatup";
    winnerHdr.style.display = "none";
    turnHdr.style.display = "none";
    clearBoard();
}

function clearBoard() {
    board.innerHTML = "";
    for(var i = 0; i < 3; i++) {
        let row = board.insertRow(i);
        for(var j = 0; j < 3; j++) {
            let cell = row.insertCell(j);
            let img = document.createElement('img');
            img.src = '/../assets/BlankSquare.png';
            cell.append(img);
            img.addEventListener('click', () => {
                socket.emit('spotChosen', {player_num: pn, 
                                           row: cell.parentNode.rowIndex,
                                           col: cell.cellIndex});
            });
        }
    }
}

function fillSpot(data) {
    let row = board.rows[data["row"]];
    let cell = row.cells[data["col"]];
    if(data["player_num"] == 1) {
        cell.childNodes[0].src = '/../assets/X.png';
    } else {
        cell.childNodes[0].src = '/../assets/O.png';
    }
    turnHdr.innerHTML = "It is Player " + data["player_turn"] + "'s turn";
}

function gameOver(data) {
    winnerHdr.style.display = "block";
    winnerHdr.innerHTML = "Player " + data["player_num"] + " wins!";
}

function catsGame() {
    winnerHdr.style.display = "block";
    winnerHdr.innerHTML = "It's a Cat's Game!";
}