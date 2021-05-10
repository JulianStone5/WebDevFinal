# TicTacToe - Web Development Final
## Casey May and Julian Stone

This repository contains code needed to run a simple multiplayer Tic-Tac-Toe game from your browser. The completed game is currently [hosted using Heroku](https://sheltered-everglades-61700.herokuapp.com/) where interactions should be able to be tested. Two players are needed to be connected in order to begin the game. Any remaining users will spectate the game. Once the game is completed, two new players are selected and able to player with spectators watching.

The application is currently built using Node JS, specifically socket.io and express.io. In order to run this application locally, first clone this repository and navigate to it on your local device. Then run the following command to confirm all correct dependencies are installed:
```
npm install
```
Then simply run the following code to deploy the server:
```
node server/server.js
```
This will host the application on your [localhost:8080](http://localhost:8080/) where you will be able to access the frontend. Remember that you will need to have at least two connections to your localhost in order to experience all interactions.

Thank you and enjoy!