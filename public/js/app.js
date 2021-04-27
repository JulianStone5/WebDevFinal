let socket = io();

const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const playerHdr = document.querySelector('.hdr-player');
const board = document.querySelector('.brd');

for(var i = 0; i < 3; i++) {
    row = board.insertRow(i);
    for(var j = 0; j < 3; j++) {
        cell = row.insertCell(j);
        cell.innerHTML = "yo";
    }
}

resetBtn.style.display = "none";
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

function startGame(data) {
    startBtn.style.display = "none";
    resetBtn.style.display = "block";
    board.style.display = "table";
    playerHdr.innerHTML = "Player " + data["player_num"];
}

function resetGame() {
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
    board.style.display = "none";
    playerHdr.innerHTML = "whatup";
}