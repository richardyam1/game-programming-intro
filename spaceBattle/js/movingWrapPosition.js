	
	function movingWrapPositionClass (){
		this.move = function(){
			 this.x +=  this.xv;
			 this.y +=  this.yv;

			this.handleScreenWrap();
		};

		this.reset = function(){
			this.xv = 0.0;
			this.yv = 0.0;
			this.x = canvas.width/2;
    		this.y = canvas.height/2;
			
		};


		this.handleScreenWrap = function(){
			if (this.x < 0){
				this.x += canvas.width;
			}
			else if(this.x > canvas.width){
				this.x += -canvas.width;
			}

			if(this.y < 0){
				this.y += canvas.height;
			}
			else if(this.y > canvas.height){
				this.y += -canvas.height;
			}
		};

		
}