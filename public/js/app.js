let socket = io();

const startBtn = document.querySelector('.btn-start');

startBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

socket.on('resetGame', () => {
    showStartButton();
});

socket.on('startGame', () => {
    hideStartButton();
});

function hideStartButton() {
    startBtn.style.display = "none";
}

function showStartButton() {
    startBtn.style.display = "block";
}