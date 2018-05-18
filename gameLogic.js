/*
  The "mitochondria" of the game!
*/

var canvas;
var canvasContext;

var ballX = 50;
var ballSpeedX = 5;

var ballY = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;

const WINNING_SCORE = 3;

var showingWinScreen = false;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) { // resets everything
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSec = 30;
    setInterval(function() {
      moveEverything();
      drawEverything();
    }, 1000/framesPerSec);

    canvas.addEventListener('mousemove',
          function(evt) {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
          });

    canvas.addEventListener('mousedown', handleMouseClick);
}

function ballReset() {
  if(player1Score >= WINNING_SCORE ||
      player2Score >= WINNING_SCORE){ // if either player wins
    showingWinScreen  = true;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

  if(paddle2YCenter < ballY-35){
    paddle2Y += 6;
  } else if(paddle2YCenter > ballY+35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if(showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;

  if(ballX < 0){ // passes left side
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);

      ballSpeedY = deltaY * 0.35;

    } else {
      player2Score += 1;
      ballReset();
    }
  }

  if(ballX > canvas.width){ // passes right side
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);

      ballSpeedY = deltaY * 0.35;

    } else {
      player1Score += 1;
      ballReset();
    }
  }

  // ------------------------

  ballY += ballSpeedY;

  if(ballY > canvas.height){ // touches upper bound
    ballSpeedY = -ballSpeedY;
  }

  if(ballY < 0){ // touches lower bound
    ballSpeedY = -ballSpeedY;
  }
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function drawNet() {
  for(var i = 0; i < canvas.height; i+= 40){
    colorRect((canvas.width / 2) - 1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  colorRect(0,0, canvas.width, canvas.height, 'black'); // canvas
  canvasContext.fillStyle = 'white';

  if(showingWinScreen) {
    if(player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!", 350, 200);
      canvasContext.fillText("click to continue", (canvas.width / 2) - 50 , (canvas.height / 2) + 200);
    }
    else if (player2Score >= WINNING_SCORE){
      canvasContext.fillText("Right Player Won!", 350, 200);
      canvasContext.fillText("click to continue", (canvas.width / 2) - 50 , (canvas.height / 2) + 200);
    }

    return;
  }

  drawNet();

  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // left paddle

  colorRect(canvas.width-10, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // right paddle

  colorCircle(ballX, ballY, 5, 'white'); // ball

  canvasContext.fillText(player1Score, 100,100);
  canvasContext.fillText(player2Score, canvas.width-100,100);
}
