let paused = true;
var topPressed = false;
var downPressed = false;

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const delay = ms => new Promise(res => setTimeout(res, ms));

document.getElementById("b-play").onclick = async () => {
    document.getElementById("menu").style.display = "none";
    await delay(150);
    togglePause();
};

document.getElementById("b-pause").onclick = function() {
    togglePause();
    document.getElementById("pause-menu").style.display = "block";
    document.getElementById("b-pause").style.display = "none";
}

document.getElementById("b-resume").onclick = function() {
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("b-pause").style.display = "block";
    togglePause();
}

document.getElementById("b-menu").onclick = function() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("b-pause").style.display = "block";
    reset();
}

////// GAME \\\\\\

var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// User Paddle
const user = {
    x : 10, // Venstre side af canvas
    y : (canvas.height - 100)/2, // -100 højden af paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE",
    x_speed : 0,
    y_speed : 0
}


// com Paddle
const com = {
    x : canvas.width - 20, // - width af paddle
    y : (canvas.height - 100)/2, // -100 højden af paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}
   
window.addEventListener('keydown', function (e) {
var key = e.keyCode;
if (key === 80)// p key
{
    togglePause();
}
});
   
function togglePause()
{
    if (!paused)
    {
        paused = true;
    } else if (paused)
    {
       paused= false;
    }

}

// Tegn en firkant, til at tegne paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Tegn en cirkel, til at tegne bolden
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Up" || e.key == "ArrowUp") {
        topPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function keysReleased(e) {
    // mark keys that were released
    keys[e.keyCode] = false;
} 

function startBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    velocityX = 5;
    velocityY = 5;
    ball.speed = 7;
}

// Når der scores, reset bold
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function resetPaddle(){
    user.y = (canvas.height - 100)/2;
    com.y = (canvas.height - 100)/2;
}

function resetScore(){
    user.score = 0;
    com.score = 0;
}

// Draw net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function drawFpsText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "15px fantasy";
    ctx.fillText(text, x, y);
}

// Collision
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    // com score
    if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
    } // Player Score
    else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }

    if (topPressed) {
        user.y -= 7;
        if (user.y < 0) {
            user.y = 0;
        }
    }
    else if (downPressed) {
        user.y += 7;
        if (user.y + user.height > canvas.height) {
            user.y = canvas.height - user.height;
        }
    }

    if (com.y < 0) {
        com.y = 0;
    } else if (com.y + com.height > canvas.height) {
        com.y = canvas.height - com.height;
    }
    
    // Giv bolden en hastighed
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    user.y += user.y_speed;

    // Simpel AI
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // Når bolden rammer toppen eller bunden, så vender vi Y velocity
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // vi tjekker om bolden rammer spilleren eller comens paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // Hvis bolden rammer paddlen
    if(collision(ball,player)){
        // Vi Tjekker hvor bolden rammer padlen
        let collidePoint = (ball.y - (player.y + player.height/2));
        // Normalizer tallene i collidePoint, vi skal have numre mellem -1 og 1
        collidePoint = collidePoint / (player.height/2);
        
        // Nå bolden rammer toppen af paddlen vil vi have bolden til at gå 45 grader
        // Nå bolden rammer midten af paddlen vil vi have bolden til at gå 0 grader
        // Nå bolden rammer bunden af paddlen vil vi have bolden til at gå 45 grader
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;
        
        // Ændrer X og Y velocity
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Speed up bolden når den rammer en paddle
        ball.speed += 0.1;
    }

    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

var fpsOut = 0;
setInterval(function(){
  fpsOut = (1000/frameTime).toFixed(1);
},1000);

// render function, functionen der laver alt vores tegning
function render(){
    
    // Rengør canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // Tegn user score til venstre
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // Tegn com score til højre
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    drawFpsText("FPS: " + fpsOut, 5, 17);
    
    // Tegn nettet
    drawNet();
    
    // Tegn user paddle
    drawRect(user.x, user.y, user.width, user.height, user.color, user.y_speed);
    
    // Tegn com paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // Tegn bolden
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function reset(){
    startBall();
    resetPaddle();
    resetScore();
}

function game(){
    if(!paused)
    { 
    update(); 
    }
    render();
}

// Nummer af FPS
let framePerSecond = 60;

// Kald spil functionen x antal gange i sekundet
let loop = setInterval(game,1000/framePerSecond);