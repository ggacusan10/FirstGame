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
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

function moveEverything() {
  ballX = ballX + ballSpeedX;

  if(ballX < 0){ // passes left side
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }

  if(ballX > canvas.width){ // passes right side
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }

  // ------------------------

  ballY = ballY + ballSpeedY;

  if(ballY > canvas.height){
    ballSpeedY = -ballSpeedY;
  }

  if(ballY < 0){
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

function drawEverything() {
  colorRect(0,0, canvas.width, canvas.height, 'black'); // canvas

  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // left paddle

  colorRect(canvas.width-10, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // right paddle

  colorCircle(ballX, ballY, 5, 'white'); // ball
}
