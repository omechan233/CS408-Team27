var Menu = {};

Menu.preload = function() {
	game.load.image('start', 'assets/start.png');
	game.load.image('startActive', 'assets/start_select.png');
	game.load.image('account', 'assets/account.png');
	game.load.image('accountActive', 'assets/account_select.png');
	game.load.image('score', 'assets/scores.png');
	game.load.image('scoreActive', 'assets/scores_select.png');
	game.load.image('difficulty', 'assets/login.png');
}

var difficulty = "easy";

Menu.create = function() {
	game.world.width = game.camera.width;
	game.world.height = game.camera.height;

	game.stage.backgroundColor = '#2a93c7';
	startBtn = game.add.button(0, 0, 'start', startGame, this);
	startBtn.scale.setTo(1.2, 1.2);
	startBtn.x = game.world.centerX - (startBtn.width / 2);
	startBtn.y = game.world.centerY - (startBtn.height / 2) + 40;
	startBtn.onInputOver.add(startOver, this);
	startBtn.onInputOut.add(startOut, this);

	scoreBtn = game.add.button(0, 0, 'score', viewScore, this);
	scoreBtn.scale.setTo(1.2, 1.2);
	scoreBtn.x = game.world.centerX - (scoreBtn.width / 2);
	scoreBtn.y = game.world.centerY - (scoreBtn.height / 2) + 130;
	scoreBtn.onInputOver.add(scoreOver, this);
	scoreBtn.onInputOut.add(scoreOut, this);

	accountBtn = game.add.button(10, 10, 'account', viewProfile, this);
	accountBtn.scale.setTo(1.2, 1.2);
	accountBtn.onInputOver.add(accountOver, this);
	accountBtn.onInputOut.add(accountOut, this);

	difficultyBtn = game.add.button(startBtn.x + 15, startBtn.y + 45, 'difficulty', changeDifficulty, this);
	difficultyBtn.scale.setTo(.8, .8);
	var style = { font: "Lucida Console", fontSize: "18px", wordWrap: false, align: "center", fontWeight: "bold" };
	difficultyText = game.add.text(difficultyBtn.x + 150, difficultyBtn.y + 8, "Difficulty: easy", style);
}

function showDifficulty() {
	difficultyText.setText("Difficulty: " + difficulty);
}

function changeDifficulty() {
	switch(difficulty) {
		case "easy":
			difficulty = "medium";
			break;

		case "medium":
			difficulty = "hard";
			break;

		case "hard":
			difficulty = "easy";
			break;
	}
	showDifficulty();
}

function startGame() {
	game.state.start('Gameplay');
}

function viewScore() {
	game.stage.backgroundColor = '#00ff00';
	game.state.start('HighScores');
}

function viewProfile() {
	game.stage.backgroundColor = '#0000ff';
	game.state.start('Account');
}

// Potential Bug; breaks signup page when uncommented, breaks menu when commented.

Menu.startOver = function() {
	startBtn.loadTexture('startActive');
}

Menu.startOut = function() {
	startBtn.loadTexture('start');
}

// End potential bug

function scoreOver() {
	scoreBtn.loadTexture('scoreActive');
}

function scoreOut() {
	scoreBtn.loadTexture('score');
}

function accountOver() {
	accountBtn.loadTexture('accountActive');
}

function accountOut() {
	accountBtn.loadTexture('account');
}
