var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");
var width = 1000;
var height = 600;
var left_score = 0;
var right_score = 0;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball((width/2), (height/2));

var keysDown = {};

var render = function () {
context.fillStyle = "#000000";
context.fillRect(0, 0, width, height);
player.render();
computer.render();
ball.render();
context.fillText(left_score,250,80);
context.fillText(right_score,750,80);
context.font = "100px Monospace";
};

var update = function () {
player.update();
computer.update(ball);
ball.update(player.paddle, computer.paddle);
};

var step = function () {
update();
render();
animate(step);
};

function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.x_speed = 0;
this.y_speed = 0;
}

Paddle.prototype.render = function () {
context.fillStyle = "#FFFFFF";
context.fillRect(this.x, this.y, this.width, this.height);
};

// Rammer for paddles
Paddle.prototype.move = function (x, y) {
this.x += x;
this.y += y;
this.x_speed = x;
this.y_speed = y;
if (this.y < 0) {
    this.y = 0;
    this.y_speed = 0;
} else if (this.y + this.height > height) {
    this.y = height - this.height;
    this.y_speed = 0;
}
};

function Computer() {
this.paddle = new Paddle((width-20), (height/2-35), 10, 70);
}

Computer.prototype.render = function () {
this.paddle.render();
};

Computer.prototype.update = function (ball) {
    var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if (diff < 0 && diff < -7) {
        diff = -5;
    } else if (diff > 0 && diff > 7) {
        diff = 5;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
        this.paddle.y = height - this.paddle.height;
    }
};

function Player() {
this.paddle = new Paddle(10, (height/2-35), 10, 70);
}

Player.prototype.render = function () {
this.paddle.render();
};

Player.prototype.update = function () {
for (var key in keysDown) {
    var value = Number(key);
    if (value == 38) {
        this.paddle.move(0, -7);
    } else if (value == 40) {
        this.paddle.move(0, 7);
    } else {
        this.paddle.move(0, 0);
    }
}
};

function Ball(x, y) {
this.x = x;
this.y = y;
this.x_speed = -5;
this.y_speed = 0;
}

Ball.prototype.render = function () {
context.beginPath();
context.arc(this.x, this.y, 5, 2 * Math.PI, false);
context.fillStyle = "#FFFFFF";
context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
this.x += this.x_speed;
this.y += this.y_speed;
var right_x = this.x - 5;
var right_y = this.y - 5;
var left_x = this.x + 5;
var left_y = this.y + 5;

if (this.y - 5 < 0) {   // Hitting the top wall
    this.y = 5;
    this.y_speed = -this.y_speed;
} else if (this.y + 5 > height) {  // Hitting the bottom wall
    this.y = height - 5;
    this.y_speed = -this.y_speed;
}

if (this.x < 0 || this.x > width) {   // A point was scored
    this.x_speed = -5;
    this.y_speed = 0;
    this.x = width / 2;
    this.y = height / 2;
}

if (this.x < 5) {
    right_score = right_score + 1;
}

if (this.x > width - 5) {
    left_score = left_score + 1;
}

if(right_x < height) {
    if(right_y < (paddle1.y + paddle1.height) && left_y > paddle1.y && right_x < (paddle1.x + paddle1.width) && left_x > paddle1.x) {
      // hit the player's paddle
      this.x_speed = 5;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(right_y < (paddle2.y + paddle2.height) && left_y > paddle2.y && right_x < (paddle2.x + paddle2.width) && left_x > paddle2.x) {
      // hit the computer's paddle
      this.x_speed = -5;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};

window.onload = function() {
    this.document.body.appendChild(canvas);
    this.animate(step);
};

window.addEventListener("keydown", function (event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
delete keysDown[event.keyCode];
});