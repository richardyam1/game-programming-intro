	var picsToLoad = 0;
	var carPic = document.createElement("img");
	var trackPics = [];
	var trackPicRoad = document.createElement("img");
	var trackPicWall = document.createElement("img");
	var trackPicGoal = document.createElement("img");
	var trackPicTree = document.createElement("img");
	var trackPicFlag = document.createElement("img");

	function countLoadedImageAndLaunchIfReady(){
		picsToLoad--;
		if(picsToLoad === 0){
			loadingDoneSoStartGame();
		}
	}

	function loadImages(){
		var imageList = [
			{varName: carPic, theFile: "player1.png"},
			{trackType: TRACK_ROAD, theFile: "track_road.png"},
			{trackType: TRACK_WALL, theFile: "track_wall.png"},
			{trackType: TRACK_GOAL, theFile: "track_goal.png"},
			{trackType: TRACK_TREE, theFile: "track_tree.png"},
			{trackType: TRACK_FLAG, theFile: "track_flag.png"}
		];

		picsToLoad = imageList.length;

		for(var i = 0; i < imageList.length; i++){
			if(imageList[i].trackType != undefined){
				loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile);
			}
			else{
				beginLoadingImage(imageList[i].varName, imageList[i].theFile);
			}
		}
		
	}

	function beginLoadingImage(imgVar, fileName){
		//picsToLoad++;
		imgVar.onload = countLoadedImageAndLaunchIfReady;
		imgVar.src = "images/" + fileName;
	}

	function loadImageForTrackCode(trackCode, fileName){
		trackPics[trackCode] = document.createElement("img");
		beginLoadingImage(trackPics[trackCode], fileName);
	}