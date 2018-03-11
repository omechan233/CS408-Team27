var HighScores = {};

HighScores.preload = function() {
	game.load.image('menu', 		'assets/menu/login.png');
	game.load.image('menuActive', 	'assets/menu/login_select.png');
}

HighScores.create = function() {

	scoreText = [];
	topScoreY = 0;
	bottomScoreY = 0;

	isGlobalScore = false;

	scoreTypeText = game.add.text(window.innerWidth / 2, 0, "Local Highscores");
	scoreTypeText.anchor.setTo(0.5, 0);

	menuBtn = game.add.button(10, 10, 'menu', this.goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(menuOver, this);
	menuBtn.onInputOut.add(menuOut, this);

	switchScoresBtn = game.add.button(10, 50, 'menu', this.switchScores, this);
	switchScoresBtn.scale.setTo(1.2, 1.2);

	this.getPlayerScores();

	style = { font: "Lucida Console", fontSize: "32px", fill: "#000000", wordWrap: false, fontWeight: "bold" };
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	topPos = 100;
	topScoreY = topPos;
}

HighScores.update = function() {
	if (upKey.isDown) {
		this.scrollUp();
	}
	else if (downKey.isDown) {
		this.scrollDown();
	}
}

HighScores.showScores = function(scores) {
	scores.sort(this.compareDescending);
	for (var i = 0; i < scoreText.length; i++) {
		scoreText[i].destroy();
	}
	for (var i = 0; i < scores.length; i++) {
		var temp = game.add.text(game.world.centerX, i * 50 + 100, scores[i], style);
		temp.anchor.setTo(0.5, 0.5);
		scoreText.push(temp);
	}
	bottomScoreY = scores.length * 50 + 100;
}

HighScores.getGlobalScores = function() {
	socket = io.connect();
	var glbScores;
	socket.emit('getGlobalScores');
	socket.on('globalScores', (globalScores) => {
		this.showScores(globalScores);
	});
}

HighScores.getPlayerScores = function() {
	socket = io.connect();
	var usrScores;
	socket.emit('getScores');
	socket.on('userScores', (highscores) => {
		this.showScores(highscores);
	});
}

HighScores.switchScores = function() {
	isGlobalScore = !isGlobalScore;
	if (isGlobalScore) {
		scoreTypeText.setText("Global Highscores");
		this.getGlobalScores();
	} else {
		scoreTypeText.setText("Local Highscores");
		this.getPlayerScores();
	}
}

HighScores.goToMenu = function() {
	game.state.clearCurrentState();
	game.state.start('Menu');
}

HighScores.menuOver = function() {
	menuBtn.loadTexture('menuActive');
}

HighScores.menuOut = function() {
	menuBtn.loadTexture('menu');
}

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

HighScores.compareAscending = function(a, b) {
	return a - b;
}

HighScores.compareDescending = function(a, b) {
	return b - a;
}
