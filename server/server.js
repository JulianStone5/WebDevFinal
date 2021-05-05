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
var waitlist = [];
var board = [[0,0,0],[0,0,0],[0,0,0]];
var gameOverFlag = false, gameStartedFlag = false;
var playerTurn = 1;

io.on('connection', (socket) => {
	console.log('A user just connected.');
    waitlist.push(socket);
    if(gameStartedFlag) {
        io.sockets.to(socket.id).emit('catchUp', {state : board, player_num : 0, player_turn : playerTurn});
    } else {
        updatePreGame();
        // waitlist.forEach((s) => {
        //     let canStart = true;
        //     if(waitlist.length < 2) {
        //         canStart = false;
        //     } else if(s != waitlist[0] && s != waitlist[1]) {
        //         canStart = false;
        //     }
        //     io.sockets.to(s.id).emit('updatePlayerCount',{player_count : waitlist.length, can_start : canStart});
        // });
    }

    socket.on('startGame', () => {
        if(waitlist.length >= 2) {
            gameStartedFlag = true;
            player1 = waitlist.shift();
            player2 = waitlist.shift();
            io.sockets.to(player1.id).emit('startGame',{player_num : 1, player_turn : playerTurn});
            io.sockets.to(player2.id).emit('startGame',{player_num : 2, player_turn : playerTurn});
            waitlist.forEach(s => io.sockets.to(s.id).emit('startGame', {player_num : 0, player_turn : playerTurn}));
        }
    });

    socket.on('resetGame', () => {
        board = [[0,0,0],[0,0,0],[0,0,0]];
        gameOverFlag = false;
        gameStartedFlag = false;
        playerTurn = 1;
        waitlist.push(player1);
        waitlist.push(player2);
        player1 = 0, player2 = 0;
        io.emit('resetGame',{player_count : waitlist.length});
        updatePreGame();
    });

    socket.on('spotChosen', (data) => {
        let row = data["row"];
        let col = data["col"];
        if(playerTurn == data["player_num"] && board[row][col] == 0 && !gameOverFlag) {
            board[row][col] = data["player_num"];
            playerTurn = -1 * playerTurn + 3;
            data["player_turn"] = playerTurn;
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
        if(socket == player1 || socket == player2) {
            io.emit('resetGame',{player_count : waitlist.length});
            board = [[0,0,0],[0,0,0],[0,0,0]];
            gameOverFlag = false;
            gameStartedFlag = false;
            playerTurn = 1;
            waitlist.unshift(player1,player2);
        }
        waitlist.splice(waitlist.indexOf(socket),1);
        updatePreGame();
    });
});

function updatePreGame() {
    waitlist.forEach((s) => {
        let canStart = true;
        if(waitlist.length < 2) {
            canStart = false;
        } else if(s != waitlist[0] && s != waitlist[1]) {
            canStart = false;
        }
        io.sockets.to(s.id).emit('updatePlayerCount',{player_count : waitlist.length, can_start : canStart});
    });
}

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