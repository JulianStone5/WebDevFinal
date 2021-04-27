let socket = io();

const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
resetBtn.style.display = "none";
const playerHdr = document.querySelector('.hdr-player');

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
    playerHdr.innerHTML = "Player " + data["player_num"];
}

function resetGame() {
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
    playerHdr.innerHTML = "whatup";
}