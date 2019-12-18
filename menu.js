// Canvas
canvas = document.getElementById("canvas");
pong = canvas.getContext('2d');
width = 1000;
height = 600;

// Definerer canvassets størelse
canvas.width = width;
canvas.height = height;

mouseX = 0;
mouseY = 0;

bgImage = new Image();
logoImage = new Image();
playImage = new Image();
instructImage = new Image();
settingsImage = new Image();
creditsImage = new Image();
shipImage = new Image();

backgroundY = 0;
speed = 0;

buttonX = [455,359,403,418];
buttonY = [260,300,340,380];
buttonWidth = [96,285,195,165];
buttonHeight = [40,40,40,40];

shipX = [0,0];
shipY = [0,0];
shipWidth = 35;
shipHeight = 35;

shipVisible = false;
shipSize = shipWidth;
shipRotate = 0;

frames = 30;
timerId = 0;
fadeId = 0;
time = 0.0;

shipImage.src = "Images/Ball.png";
bgImage.onload = function(){
    pong.drawImage(bgImage, 0, backgroundY);
};

bgImage.src = "Images/Pong-Canvas.png";
logoImage.onload = function(){
    pong.drawImage(logoImage, 50, -10);
};

logoImage.src = "Images/logo.png";
playImage.onload = function(){
    pong.drawImage(playImage, buttonX[0], buttonY[0]);
};

playImage.src = "Images/play.png";
instructImage.onload = function(){
    pong.drawImage(instructImage, buttonX[1], buttonY[1]);
};

instructImage.src = "Images/instructions.png";
settingsImage.onload = function(){
    pong.drawImage(settingsImage, buttonX[2], buttonY[2]);
};

settingsImage.src = "Images/settings.png";
creditsImage.onload = function(){
    pong.drawImage(creditsImage, buttonX[3], buttonY[3]);
};

creditsImage.src = "Images/credits.png";

timerId = setInterval("update()", 1000/frames);

canvas.addEventListener("mousemove", checkPos);
canvas.addEventListener("mouseup", checkClick);

function update() {
    clear();
    move();
    draw();
};

function clear() {
    pong.clearRect(0, 0, width, height);
};

function move(){
    backgroundY -= speed;
    if(backgroundY == -1 * height){
    backgroundY = 0;
    }
    if(shipSize == shipWidth){
    shipRotate = -1;
    }
    if(shipSize == 0){
    shipRotate = 1;
    }
    shipSize += shipRotate;
};

function draw(){
    pong.drawImage(bgImage, 0, backgroundY);
    pong.drawImage(logoImage, 298, 100);
    pong.drawImage(playImage, buttonX[0], buttonY[0]);
    pong.drawImage(instructImage, buttonX[1], buttonY[1]);
    pong.drawImage(settingsImage, buttonX[2], buttonY[2]);
    pong.drawImage(creditsImage, buttonX[3], buttonY[3]);
    
    if(shipVisible == true){
        pong.drawImage(shipImage, shipX[0] - (shipSize/2), shipY[0], shipSize, shipHeight);
        pong.drawImage(shipImage, shipX[1] - (shipSize/2), shipY[1], shipSize, shipHeight);
    };
};

function checkPos(mouseEvent){
    if(mouseEvent.pageX || mouseEvent.pageY == 0){
        mouseX = mouseEvent.pageX - this.offsetLeft;
        mouseY = mouseEvent.pageY - this.offsetTop;
    }else if(mouseEvent.offsetX || mouseEvent.offsetY == 0){
        mouseX = mouseEvent.offsetX;
        mouseY = mouseEvent.offsetY;
    };

    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                shipVisible = true;
                shipX[0] = buttonX[i] - (shipWidth/2) - 2;
                shipY[0] = buttonY[i] + 2;
                shipX[1] = buttonX[i] + buttonWidth[i] + (shipWidth/2); 
                shipY[1] = buttonY[i] + 2;
            };
        }else{
            shipVisible = false;
        };
    };
};

function checkClick(mouseEvent){
    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                fadeId = setInterval("fadeOut()", 1000/frames);
                clearInterval(timerId);
                canvas.removeEventListener("mousemove", checkPos);
                canvas.removeEventListener("mouseup", checkClick);
            };
        };
    };
};

// function fadeOut(){
//     pong.fillStyle = "rgba(0,0,0, 0.2)";
//     pong.fillRect (0, 0, width, height);
//     time += 0.1;
//     if(time >= 2){
//         clearInterval(fadeId);
//         time = 0;
//         timerId = setInterval("update()", 1000/frames);
//         canvas.addEventListener("mousemove", checkPos);
//         canvas.addEventListener("mouseup", checkClick);
//     };
// };

function myFunction() {
    var x = document.getElementById("canvas");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}