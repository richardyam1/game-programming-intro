var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
//Make thickness greater than ball possible maximum speed to prevent ball from passing through paddle
const PADDLE_THICKNESS = MAX_BALL_SPEED + 2;
const DIST_FROM_EDGE = 120;
const cpuSpeed = 11;

function moveComputerPaddle(){
	//if ball is below paddle center
	if (ballY > (paddle2Y + PADDLE_HEIGHT/2) + 35){
	    paddle2Y += cpuSpeed;
	}
	//if ball is above paddle center
	else if (ballY < (paddle2Y + PADDLE_HEIGHT/2 - 35)){
	    paddle2Y -= cpuSpeed;
	}
}

function paddleDraw(){
	drawBitmapPositionedByTopLeftCorner(player1Paddle, DIST_FROM_EDGE, paddle1Y);
	drawBitmapPositionedByTopLeftCorner(player2Paddle, canvas.width - player2Paddle.width - DIST_FROM_EDGE, paddle2Y);
}
