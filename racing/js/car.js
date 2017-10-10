const GROUNDSPEED_DECAY_MULT = 0.94;
const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.03;
const MIN_TURN_SPEED = 0.5;

//Use class so both cars have access to code below.
function carClass (){
	this.carX = 75;
	this.carY = 75;
	this.keyHeld_Gas = false;
	this.keyHeld_Reverse = false;
	this.keyHeld_TurnLeft = false;
	this.keyHeld_TurnRight = false;
	this.carOnOil = false;
	this.setupControls = function(forwardKey, backKey, leftKey, rightKey){
			this.controlKeyForGas = forwardKey;
			this.controlKeyForReverse = backKey;
			this.controlKeyForTurnLeft = leftKey;
			this.controlKeyForTurnRight = rightKey;
		}

	this.carDraw = function(){
		drawBitmapCenteredAtLocationWithRotation(this.myBitmap, this.carX, this.carY, this.carAng );	
	};

	this.carMove = function(){
		if(Math.abs(this.carSpeed) >= MIN_TURN_SPEED){
			if(this.keyHeld_TurnLeft && this.carOnOil === false){
				this.carAng += -TURN_RATE*Math.PI;
			}
			if(this.keyHeld_TurnRight && this.carOnOil === false){
				this.carAng += TURN_RATE*Math.PI;
			}
		}
		if(this.keyHeld_Gas){
			raceStarted = true;
			this.carSpeed += DRIVE_POWER;
		}
		if(this.keyHeld_Reverse){
			this.carSpeed += -REVERSE_POWER;
		}

		var nextX = this.carX + Math.cos(this.carAng) * this.carSpeed;
		var nextY = this.carY + Math.sin(this.carAng) * this.carSpeed;

		var drivingIntoTileType = getTrackAtPixelCoord(nextX, nextY);
		//check if next tile is a road.
		if(drivingIntoTileType === TRACK_ROAD){
			this.carOnOil = false;
			this.carX = nextX;
			this.carY = nextY;
		}

		else if(drivingIntoTileType === TRACK_PLAYER){
			this.carOnOil = false;
			this.carX = this.carX - Math.cos(this.carAng) * this.carSpeed;
			this.carY = this.carY - Math.sin(this.carAng) * this.carSpeed
		}

		else if(drivingIntoTileType ===TRACK_GRASS){
			this.carOnOil = false;
			this.carX = this.carX + Math.cos(this.carAng) * this.carSpeed/2;
			this.carY = this.carY + Math.sin(this.carAng) * this.carSpeed/2;
		}

		else if(drivingIntoTileType === TRACK_OIL){
			this.carOnOil = true;
			this.carX = nextX;
			this.carY = nextY;
		}
		
		//check if next tile is the goal line
		else if(drivingIntoTileType === TRACK_GOAL){
			document.getElementById("debugText").innerHTML = this.myName + " won the race";
			p1.carReset();
			p2.carReset();
		}
		//if car hits a wall
		else{
			this.carSpeed = 0.0;
		}
		
		//slows down the car when key is not pressed
		this.carSpeed *= GROUNDSPEED_DECAY_MULT;
	};
	//reset car to starting position when goal line is reached
	this.carReset = function(){
		//reset speed so car resets to a complete stop
		this.carSpeed = 0;
		this.carAng = (-0.5 * Math.PI);
		if(this.homeX === undefined){
			for(var i = 0; i < trackGrid.length; i++){
				if(trackGrid[i] === TRACK_PLAYER){
					var tileRow = Math.floor(i/TRACK_COLS);
					var tileCol = i%TRACK_COLS;
					this.homeX = tileCol * TRACK_W + 0.5*TRACK_W;
					this.homeY = tileRow * TRACK_H + 0.5*TRACK_H;
					trackGrid[i] = TRACK_ROAD;
					break;
				}
			}
		}
		this.carX = this.homeX;
		this.carY = this.homeY;
		raceStarted = false;
	};

	//Initialize car for p1 and p2
	this.carInit = function(whichGraphic, whichName){
		this.myBitmap = whichGraphic;
		this.myName = whichName;
		this.carReset();
	};
}

function detectCollision(car1, car2){
	//Distance between 2 cars on x-axis
	var dx = (car1.carX + carPic.width/2) - (car2.carX + car2Pic.width/2);
	//Distance between 2 cars on y-axis
	var dy = (car1.carY + carPic.height/2) - (car2.carY + car2Pic.height/2);
	var width = (carPic.width + car2Pic.width)/2;
	var height = (carPic.height + car2Pic.height)/2;
	var crossWidth = width * dy;
	var crossHeight = height * dx;
	var collision = "none"; 

	if(Math.abs(dx) <= width && Math.abs(dy) <= height){
        if(crossWidth>crossHeight){
            collision=(crossWidth>(-crossHeight))?'bottom':'left';
        }else{
            collision=(crossWidth>-(crossHeight))?'right':'top';
        }
    }
    
    if(collision === "bottom"){
    	car1.carY += 10;
    	car2.carY -= 10;
    }
    else if(collision === "left"){
		car1.carX += 10;
		car2.carX -= 10;
    }
    else if(collision === "right"){
		car1.carX -= 10;
		car2.carX += 10;
    }
    else if(collision === "top"){
		car1.carY -= 10;
		car2.carY += 10;
    }
}

function cpuCarMove(cpu){

	var carRandom = Math.floor(Math.random() * 3);

	if(carRandom === 0){
		cpu.keyHeld_Reverse = false;
		cpu.keyHeld_Gas = true;
	}
	else if(carRandom === 1){
		cpu.keyHeld_TurnRight = false;
		cpu.keyHeld_TurnLeft = true;
	}
	else if(carRandom === 2){
		cpu.keyHeld_TurnLeft = false;
		cpu.keyHeld_TurnRight = true;
	}
	else if(carRandom === 3){
		cpu.keyHeld_Gas = false;
		cpu.keyHeld_Reverse = true;
	}
	
	if(cpu.keyHeld_Gas){
		raceStarted = true;
		cpu.carSpeed += DRIVE_POWER;
	}
	if(cpu.keyHeld_Reverse){
		cpu.carSpeed += -REVERSE_POWER;
	}


	var nextX = cpu.carX + Math.cos(cpu.carAng) * cpu.carSpeed;
	var nextY = cpu.carY + Math.sin(cpu.carAng) * cpu.carSpeed;

	var drivingIntoTileType = getTrackAtPixelCoord(nextX, nextY);
	//check if next tile is a road.
	if(drivingIntoTileType === TRACK_ROAD){
		cpu.carOnOil = false;
		cpu.carX = nextX;
		cpu.carY = nextY;
	}

	else if(drivingIntoTileType === TRACK_PLAYER){
		cpu.carOnOil = false;
		cpu.carX = cpu.carX - Math.cos(cpu.carAng) * cpu.carSpeed;
		cpu.carY = cpu.carY - Math.sin(cpu.carAng) * cpu.carSpeed
	}

	else if(drivingIntoTileType ===TRACK_GRASS){
		cpu.carOnOil = false;
		cpu.carX = cpu.carX + Math.cos(cpu.carAng) * cpu.carSpeed/2;
		cpu.carY = cpu.carY + Math.sin(cpu.carAng) * cpu.carSpeed/2;
	}

	else if(drivingIntoTileType === TRACK_OIL){
		cpu.carOnOil = true;
		cpu.carX = nextX;
		cpu.carY = nextY;
	}
	
	//check if next tile is the goal line
	else if(drivingIntoTileType === TRACK_GOAL){
		document.getElementById("debugText").innerHTML = cpu.myName + " won the race";
		p1.carReset();
		p2.carReset();
	}
	//if car hits a wall
	else{
		cpu.carSpeed = 0.0;
	}
	
	//slows down the car when key is not pressed
	cpu.carSpeed *= GROUNDSPEED_DECAY_MULT;
	
	setTimeout(function(){
		cpuCarMoving = false;
	}, 1000);

	function cpuCarKeyReset(){
		cpu.keyHeld_Gas = false;
		cpu.keyHeld_Reverse = false;
		cpu.keyHeld_TurnLeft = false;
		cpu.keyHeld_TurnRight = false;
	}
}

