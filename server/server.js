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
var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameOverFlag = false;
var player_turn = 1;

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
        if(player1 != 0 && player2 != 0) {
            io.sockets.to(player1.id).emit('startGame',{player_num : 1});
            io.sockets.to(player2.id).emit('startGame',{player_num : 2});
        }
    });

    socket.on('resetGame', () => {
        board = [[0,0,0],[0,0,0],[0,0,0]];
        gameOverFlag = false;
        player_turn = 1;
        io.emit('resetGame');
    });

    socket.on('spotChosen', (data) => {
        let row = data["row"];
        let col = data["col"];
        if(player_turn == data["player_num"] && board[row][col] == 0 && !gameOverFlag) {
            board[row][col] = data["player_num"];
            player_turn = -1 * player_turn + 3;
            data["player_turn"] = player_turn;
            io.emit('spotChosen', data);
            gameOverFlag = isGameOver(data);
            if(gameOverFlag) {
                io.emit('gameOver', {player_num: data["player_num"]});
            } else if(isCatsGame()) {
                io.emit('catsGame');
                gameOverFlag = true;
            }
            
        }
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
        io.emit('resetGame');
        board = [[0,0,0],[0,0,0],[0,0,0]];
        gameOverFlag = false;
        player_turn = 1;
        if(socket.id == player1.id) {
            player1 = 0;
        } else if(socket.id == player2.id) {
            player2 = 0;
        }
    });
});

function isGameOver(data) {
    let row = data["row"];
    let col = data["col"];
    let pn = data["player_num"];
    var horWin = true, verWin = true, downDiag = true, upDiag = true;
    for(var i = 0; i < 3; i++) {
        horWin = (board[row][i] == pn) && horWin;
        verWin = (board[i][col] == pn) && verWin;
        downDiag = (board[i][i] == pn) && downDiag;
        upDiag = (board[2-i][i] == pn) && upDiag;
    }
    return horWin || verWin || downDiag || upDiag;
}

function isCatsGame() {
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if(board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}