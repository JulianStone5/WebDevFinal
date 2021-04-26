let socket = io();

const startBtn = document.querySelector('.btn-start');

startBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

socket.on('startGame', () => {
    hideStartButton();
});

function hideStartButton() {
    startBtn.style.display = "none";
}