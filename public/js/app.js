let socket = io();

const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');

startBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

resetBtn.addEventListener('click', () => {
    socket.emit('resetGame');
});

socket.on('resetGame', () => {
    resetGame();
});

socket.on('startGame', () => {
    startGame();
});

function startGame() {
    startBtn.style.display = "none";
    resetBtn.style.display = "block";
}

function resetGame() {
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
}