// Variabler
let paused = true;
let aiControl = false;
var topPressed = false;
var downPressed = false;
var gTopPressed = false;
var gDownPressed = false;

// Definer Canvas
const canvas = document.getElementById("canvas");

// Definer Context til 2D
const ctx = canvas.getContext("2d");

// Definere function delay så vi kan pause spillet i 3 sekunder ved spil start.
const delay = ms => new Promise(res => setTimeout(res, ms));

////// MENU \\\\\\

// Når vi klikker "play" gemmes menuen og spillet vises, spillet pauses her i 3 sekunder, så spilleren kan forberede sig.
document.getElementById("b-play").onclick = function() {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("choose-game").style.display = "block";
}

document.getElementById("b-playerVScomputer").onclick = async () => {
    document.getElementById("menu").style.display = "none";
    if (aiControl == false) {
        aiControlled()
    }
    await delay(150);
    togglePause();
}

document.getElementById("b-playerVSplayer").onclick = async () => {
    document.getElementById("menu").style.display = "none";
    if (aiControl == true) {
        aiControlled()
    }
    await delay(150);
    togglePause();
}

// document.getElementById("b-play").onclick = async () => {
//     document.getElementById("menu").style.display = "none";
//     await delay(150);
//     togglePause();
// };

console.log(aiControl)

// Her fanger vi vores menu elementer og giver dem deres display styles.
// På denne måde kan vi gemme specifikke menuer når de ikke skal bruges/vises.
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
    document.getElementById("choose-game").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("pause-menu").style.display = "none";
    document.getElementById("b-pause").style.display = "block";
    reset();
}

function aiControlled() {
    if (!aiControl)
    {
        aiControl = true;
    } else if (aiControl)
    {
       aiControl = false;
    }
}

////// GAME \\\\\\

// Her specificerer vi vores filterstrenght og frametime brugt til vores FPS counter.
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

// playerOne Paddle
const playerOne = {
    x : 10, // Venstre side af canvas
    y : (canvas.height - 100)/2, // -100 højden af paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE",
}

// playerTwo Paddle
const playerTwo = {
    x : canvas.width - 20, // Højre side af canvas
    y : (canvas.height - 100)/2, // -100 højden af paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE",
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// Her definere vi tasten "p" til vores demo af pause funktionen. Bliver fjernet senere.
window.addEventListener('keydown', function (e) {
var key = e.keyCode;
if (key === 80)// p key
{
    togglePause();
}
});

// Functionen for at pause spillet.
function togglePause()
{
    if (!paused)
    {
        paused = true;
    } else if (paused)
    {
       paused = false;
    }

}

console.log(aiControl)

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

// Her tilføjer vi nogle EventListeners så vi kan fange keyboard input.
// Som f.eks. "W" og "S" til playerOne og senere "ArrowUp" og "ArrowDown" til PlayerTwo.
document.addEventListener("keydown", playerOneKeyDownHandler, false);
document.addEventListener("keyup", playerOneKeyUpHandler, false);

function playerOneKeyDownHandler(e) {
    var code = e.keyCode;
    switch (code) {
        case 87: topPressed = true; break; //Key W
        case 83: downPressed = true; break; //Key S
    }
}

function playerOneKeyUpHandler(e) {
    var code = e.keyCode;
    switch (code) {
        case 87: topPressed = false; break; //Key W
        case 83: downPressed = false; break; //Key S
    }
}

function playerTwoKeyDownHandler(f) {
    var code = f.keyCode;
    if (aiControl == false) { // Stoppe spiller fra at snyde med AI tændt.
        switch (code) {
            case 38: gTopPressed = true; break; //Key ArrowUp
            case 40: gDownPressed = true; break; //Key ArrowDown
        }
    } else {
        switch (code) {
            case 38: gTopPressed = false; break; //Key ArrowUp
            case 40: gDownPressed = false; break; //Key ArrowDown
        }
    }
    
}

function playerTwoKeyUpHandler(f) {
    var code = f.keyCode;
    switch (code) {
        case 38: gTopPressed = false; break; //Key ArrowUp
        case 40: gDownPressed = false; break; //Key ArrowDown
    }
}

document.addEventListener("keydown", playerTwoKeyDownHandler, false);
document.addEventListener("keyup", playerTwoKeyUpHandler, false);

console.log(aiControl)

// Boldens start position efter reset.
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

// Paddles start position efter reset.
function resetPaddle(){
    playerOne.y = (canvas.height - 100)/2;
    playerTwo.y = (canvas.height - 100)/2;
}

// Score sættes til 0 ved spil start og hvis spiller går tilbage til menu.
function resetScore(){
    playerOne.score = 0;
    playerTwo.score = 0;
}

// Draw net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

console.log(aiControl)

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
    // PlayerTwo score
    if( ball.x - ball.radius < 0 ){
        playerTwo.score++;
        resetBall();
    } // PlayerOne Score
    else if( ball.x + ball.radius > canvas.width){
        playerOne.score++;
        resetBall();
    }

    // Hænger sammen med EventListener. Her specificerer vi hvad vi gør nå specifikke taster trykkes.
    // Her er det for "playerOne".
    if (topPressed) {
        playerOne.y -= 7;
        if (playerOne.y < 0) {
            playerOne.y = 0;
        }
    }
    else if (downPressed) {
        playerOne.y += 7;
        if (playerOne.y + playerOne.height > canvas.height) {
            playerOne.y = canvas.height - playerOne.height;
        }
    }

    // Her er det for "playerTwo"
    if (gTopPressed) {
        playerTwo.y -= 7;
        if (playerTwo.y < 0) {
            playerTwo.y = 0;
        }
    }
    else if (gDownPressed) {
        playerTwo.y += 7;
        if (playerTwo.y + playerTwo.height > canvas.height) {
            playerTwo.y = canvas.height - playerTwo.height;
        }
    }

    if (aiControl == true) {
        if (playerTwo.y < 0) {
            playerTwo.y = 0;
        } else if (playerTwo.y + playerTwo.height > canvas.height) {
            playerTwo.y = canvas.height - playerTwo.height;
        }
    }

    console.log(aiControl)
    
    // Giv bolden en hastighed
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simpel AI
    if (aiControl == true) {
        playerTwo.y += ((ball.y - (playerTwo.y + playerTwo.height/2)))*0.1;
    }

    console.log(aiControl)
    
    // Når bolden rammer toppen eller bunden, så vender vi Y velocity
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    
    // vi tjekker om bolden rammer PLayerOne eller PlayerTwo paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? playerOne : playerTwo;
    
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

    // Her finder vi vores frame count i millisekunder.
    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

// Her calculerer vi vores actuelle FPS.
var fpsOut = 0;
setInterval(function(){
  fpsOut = (1000/frameTime).toFixed(1);
},1000);

// render function, functionen der laver alt vores tegning
function render(){
    
    // Rengør canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // Tegn playerOne score til venstre
    drawText(playerOne.score,canvas.width/4,canvas.height/5);
    
    // Tegn playerTwo score til højre
    drawText(playerTwo.score,3*canvas.width/4,canvas.height/5);
    
    // Tegn vores FPS count i top venstre hjørne.
    drawFpsText("FPS: " + fpsOut, 5, 17);
    
    // Tegn nettet
    drawNet();
    
    // Tegn playerOne paddle
    drawRect(playerOne.x, playerOne.y, playerOne.width, playerOne.height, playerOne.color, playerOne.y_speed);

    // Tegn playerTwo paddle
    drawRect(playerTwo.x, playerTwo.y, playerTwo.width, playerTwo.height, playerTwo.color);
    
    // Tegn bolden
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// Her specificerer vi hvad vi vil gøre på spil restart. Når spilleren går tilbage til menuen og når spillet starter.
function reset(){
    startBall();
    resetPaddle();
    resetScore();
}

// Her sørger vi for at spillet kører så længe det ikke er paused.
// Hvis det er paused, så stopper spillet.
function game(){
    if(!paused)
    { 
    update(); 
    }
    render();
}

// Definere hvor mange frames vi vil have pr. sekund.
let framePerSecond = 60;

// Kald spil functionen x antal gange i sekundet
let loop = setInterval(game,1000/framePerSecond);

console.log(aiControl)