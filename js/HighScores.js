var HighScores = {};

var scores;
var scoreText = [];
var style;
var topScoreY;
var bottomScoreY;
var topPos;

HighScores.create = function() {
	scores = generateRandomScores(100);
	style = { font: "Lucida Console", fontSize: "32px", fill: "#000000", wordWrap: false, fontWeight: "bold" };
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	topPos = 100;
	topScoreY = topPos;
	showScores();
}

HighScores.update = function() {
	if (upKey.isDown) {
		scrollUp();
	}
	else if (downKey.isDown) {
		scrollDown();
	}
}

function showScores() {
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
