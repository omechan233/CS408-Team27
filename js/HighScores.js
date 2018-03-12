var HighScores = {};

HighScores.preload = function() {
	game.load.image('background', 		'assets/background.png');
    game.load.image('menu', 		'assets/menu/exit.png');
	game.load.image('menuActive', 	'assets/menu/exit_select.png');
	game.load.image('local',		'assets/menu/local.png');
	game.load.image('localActive',	'assets/menu/local_select.png');
	game.load.image('global',		'assets/menu/global.png');
	game.load.image('globalActive',	'assets/menu/global_select.png');
}

HighScores.create = function() {
    background = game.add.sprite(0, 0, 'background', this);
    background.width = game.camera.width;
	background.height = game.camera.height;
    
	scoreText = [];
	userText = [];
	topScoreY = 0;
	bottomScoreY = 0;

	isGlobalScore = false;

	scoreTypeText = game.add.text(window.innerWidth / 2, 0, "Local Highscores");
	scoreTypeText.anchor.setTo(0.5, 0);

	menuBtn = game.add.button(10, 10, 'menu', this.goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(() => {menuBtn.loadTexture('menuActive')}, this);
	menuBtn.onInputOut.add(() => {menuBtn.loadTexture('menu')}, this);

	localScoresBtn = game.add.button(10, 70, 'local', this.getLocalScores, this);
	localScoresBtn.scale.setTo(1.2, 1.2);
	localScoresBtn.onInputOver.add(() => {localScoresBtn.loadTexture('localActive')}, this);
	localScoresBtn.onInputOut.add(() => {localScoresBtn.loadTexture('local')}, this);

	globalScoresBtn = game.add.button(10, 130, 'global', this.getGlobalScores, this);
	globalScoresBtn.scale.setTo(1.2, 1.2);
	globalScoresBtn.onInputOver.add(() => {globalScoresBtn.loadTexture('globalActive')}, this);
	globalScoresBtn.onInputOut.add(() => {globalScoresBtn.loadTexture('global')}, this);

	this.getLocalScores();

	style = { font: "Lucida Console", fontSize: "32px", fill: "#FFFFFF", wordWrap: false, fontWeight: "bold" };
}

HighScores.update = function() {

}

HighScores.showLocalScores = function(scores) {
	scores.sort((a, b) => {
		return b - a;
	});
	for (var i = 0; i < scoreText.length; i++) {
		scoreText[i].destroy();
	}
	for (var i = 0; i < userText.length; i++) {	
		userText[i].destroy();
	}
	for (var i = 0; i < scores.length; i++) {
		var temp1 = game.add.text(game.world.centerX, i * 50 + 100, scores[i], style);
		temp1.anchor.setTo(0.5, 0.5);
		scoreText.push(temp1);
	}
	bottomScoreY = scores.length * 50 + 100;
}

HighScores.showGlobalScores = function(scores) {
	for (var i = 0; i < scoreText.length; i++) {
		scoreText[i].destroy();
	}
	for (var i = 0; i < userText.length; i++) {	
		userText[i].destroy();
	}
	for (var i = 0; i < scores.length; i++) {
		var temp1 = game.add.text(game.world.centerX, i * 50 + 100, scores[i].highscore, style);
		temp1.anchor.setTo(0.5, 0.5);
		scoreText.push(temp1);
		var temp2 = game.add.text(game.world.centerX + 100, i * 50 + 100, scores[i].username, style);
		temp2.anchor.setTo(0, 0.5);
		userText.push(temp2);
	}
	bottomScoreY = scores.length * 50 + 100;
}

HighScores.getGlobalScores = function() {
	scoreTypeText.setText("Global Highscores");
	socket = io.connect();
	var glbScores;
	socket.emit('getGlobalScores');
	socket.on('globalScores', (globalScores) => {
		this.showGlobalScores(globalScores);
	});
}

HighScores.getLocalScores = function() {
	scoreTypeText.setText("Local Highscores");
	socket = io.connect();
	var usrScores;
	socket.emit('getLocalScores');
	socket.on('localScores', (highscores) => {
		this.showLocalScores(highscores);
	});
}

HighScores.goToMenu = function() {
	game.state.clearCurrentState();
	game.state.start('Menu');
}

/* Unused functions below */
HighScores.scrollDown = function() {
	if (bottomScoreY + scoreText[scoreText.length - 1].height > game.camera.height - 10) {
		bottomScoreY -= 8;
		topScoreY -= 8;
		for (var i = 0; i < scoreText.length; i++) {
			scoreText[i].y -= 8;
		}
	}
}

HighScores.scrollUp = function() {
	if (topScoreY < topPos) {
		topScoreY += 8;
		bottomScoreY += 8;
		for (var i = 0; i < scoreText.length; i++) {
			scoreText[i].y += 8;
		}
	}
}

HighScores.generateRandomScores = function(numScores) {
	var newScores = [];
	for (var i = 0; i < numScores; i++) {
		newScores.push(Math.ceil(Math.random() * 1000));
	}
	newScores.sort(this.compareDescending);
	return newScores;
}

