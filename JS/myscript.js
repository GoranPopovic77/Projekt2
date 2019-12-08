var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 4;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var ballColor = "red";
var MySound;
var MyMusic;
var myReq;
var continueAnimating = false;
var MyMusicArr = ["CSS/audio/Hypnotic-Puzzle3.mp3", "CSS/audio/Hypnotic-Puzzle2.mp3", "CSS/audio/Hypnotic-Puzzle4.mp3"]

MySound = new sound("CSS/audio/UI_Quirky23.mp3")

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", StartGame);

function Level(id) {
  for (var i = 1;i <= 3; i++){
    if ("check" + i === id && document.getElementById("check" + i).checked === true){
            document.getElementById("check" + i).checked = true;
            level = i;
            } else {
              document.getElementById("check" + i).checked = false;
            }
    }  
}


function StartGame(e) {
  if(e.key == "s" || e.key == "S") {
    MyMusic = new sound(MyMusicArr[level - 1]);
    MyMusic.play();
    continueAnimating = true;
    dx = dx * level;
    dy = dy * level;
    draw();
  }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } 
}


function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
function changeBallColor () {
  var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    ballColor = color;
}
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          changeBallColor();
          MySound.stop();
          MySound.play();
          if(score == brickRowCount*brickColumnCount) {
            continueAnimating = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWin();
            MyMusic.stop();
            MyMusic = new sound('CSS/audio/Neon-Runner_Looping.mp3');
            MyMusic.play();
            document.body.style.backgroundImage = "url('CSS/img/you-win.png')";
            document.body.style.backgroundRepeat = "repeat";
            document.removeEventListener("keydown", StartGame);
            setTimeout(Restart, 10000);
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawStart(){
  ctx.font = "bold 30px Georgia";
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");
  ctx.strokeStyle = gradient;
  ctx.strokeText("WELCOME TO MY GAME!!!", 30, 90);
  ctx.font = "20px Arial";
  ctx.fillStyle = 'blue';
  ctx.fillText('You can control Paddle with arrows or mouse', 35, 180);
  ctx.fillText('To start playing choose level and press "s"', 50, 220);
}

function drawWin(){ 
  var i = 9;
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("YOU WIN, CONGRATS!", 85, 50);
  ctx.font = "24px Arial";
  ctx.fillStyle = "red";
  ctx.fillText('Wait for 10 seconds to play again', 70, 120);
  
  function timer(){
    ctx.clearRect(10, 220, 450, 95);
    ctx.font="75px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText( "" + i, 230, 300);
    i--;
    if (i === 0){
      clearInterval(k);
    }
  }
  var k = setInterval(timer, 1000);
}

function drawGameOver(){
  var i=9;
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 150, 50);
  ctx.font = "24px Arial";
  ctx.fillStyle = "red";
  ctx.fillText('Wait for 10 seconds to play again', 60, 120);
  function timer(){
    ctx.clearRect(10, 220, 450, 95);
    ctx.font="75px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText( "" + i, 230, 300);
    i--;
    if (i === 0){
      clearInterval(k);
    }
  }
  var k = setInterval(timer, 1000);
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function drawLevels() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: "+level, 200, 20);
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }    
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.removeEventListener("keydown", StartGame);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawLevels();
  MyMusic.play();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
        continueAnimating = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGameOver();
            document.body.style.backgroundImage = "url('CSS/img/gameover.jpg')";
            document.body.style.backgroundRepeat = "repeat";
            MyMusic.stop();
            MyMusic = new sound('CSS/audio/Neon-Runner_Looping.mp3');
            MyMusic.play();
            setTimeout(Restart, 10000);
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        //dx = 3;
        //dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
 
  if(continueAnimating)
    {
  requestAnimationFrame(draw);
    }
}
function Restart(){
  document.location.reload();
}
drawStart();

//draw();