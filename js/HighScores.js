var HighScores = {};

var scores;
var scoreText = [];
var style;
var topScoreY;
var bottomScoreY;
var topPos;

HighScores.preload = function() {
	game.load.image('menu', 'assets/login.png');
	game.load.image('menuActive', 'assets/login_select.png');
}

HighScores.create = function() {
	menuBtn = game.add.button(10, 10, 'menu', goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(menuOver, this);
	menuBtn.onInputOut.add(menuOut, this);

	//scores = generateRandomScores(100);
	getPlayerScores();
	style = { font: "Lucida Console", fontSize: "32px", fill: "#000000", wordWrap: false, fontWeight: "bold" };
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	topPos = 100;
	topScoreY = topPos;
}

HighScores.update = function() {
	if (upKey.isDown) {
		scrollUp();
	}
	else if (downKey.isDown) {
		scrollDown();
	}
}

function showScores(scores) {
	console.log(scores);
	for (var i = 0; i < scores.length; i++) {
		var temp = game.add.text(game.world.centerX, i * 50 + 100, scores[i], style);
		temp.anchor.setTo(0.5, 0.5);
		scoreText.push(temp);
	}
	bottomScoreY = scores.length * 50 + 100;
}

function getGlobalScores() {

}

function getPlayerScores() {
	socket = io.connect();
	var usrScores;
	socket.emit('getScores');
	socket.on('userScores', (highscores) => {
		console.log(highscores);
		showScores(highscores);
	});
}

function goToMenu() {
	game.state.start('Menu');
}

function menuOver() {
	menuBtn.loadTexture('menuActive');
}

function menuOut() {
	menuBtn.loadTexture('menu');
}

function scrollDown() {
	if (bottomScoreY + scoreText[scoreText.length - 1].height > game.camera.height - 10) {
		bottomScoreY -= 8;
		topScoreY -= 8;
		for (var i = 0; i < scoreText.length; i++) {
			scoreText[i].y -= 8;
		}
	}
}

function scrollUp() {
	if (topScoreY < topPos) {
		topScoreY += 8;
		bottomScoreY += 8;
		for (var i = 0; i < scoreText.length; i++) {
			scoreText[i].y += 8;
		}
	}
}

function generateRandomScores(numScores) {
	var newScores = [];
	for (var i = 0; i < numScores; i++) {
		newScores.push(Math.ceil(Math.random() * 1000));
	}
	newScores.sort(compareDescending);
	return newScores;
}

function compareAscending(a, b) {
	return a - b;
}

function compareDescending(a, b) {
	return b - a;
}
