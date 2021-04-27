const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8080;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
server.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});

var player1 = 0, player2 = 0;

io.on('connection', (socket) => {
	console.log('A user just connected.');
    if(player1 == 0) {
        player1 = socket;
    } else if(player2 == 0) {
        player2 = socket;
    } else {
        console.log("rip");
    }

    socket.on('startGame', () => {
        if(player1 != 0) { //&& player2 != 0) {
            io.sockets.to(player1.id).emit('startGame',{player_num : 1});
            io.sockets.to(player2.id).emit('startGame',{player_num : 2});
        }
    });

    socket.on('resetGame', () => {
        io.emit('resetGame');
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
        io.emit('resetGame');
        if(socket.id == player1.id) {
            player1 = 0;
        } else if(socket.id == player2.id) {
            player2 = 0;
        }
    });
});