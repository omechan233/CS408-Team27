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
	startBtn = game.add.button(0, 0, 'start', this.startGame, this);
	startBtn.scale.setTo(1.2, 1.2);
	startBtn.x = game.world.centerX - (startBtn.width / 2);
	startBtn.y = game.world.centerY - (startBtn.height / 2) + 40;
	startBtn.onInputOver.add(this.startOver, this);
	startBtn.onInputOut.add(this.startOut, this);

	scoreBtn = game.add.button(0, 0, 'score', this.viewScore, this);
	scoreBtn.scale.setTo(1.2, 1.2);
	scoreBtn.x = game.world.centerX - (scoreBtn.width / 2);
	scoreBtn.y = game.world.centerY - (scoreBtn.height / 2) + 130;
	scoreBtn.onInputOver.add(this.scoreOver, this);
	scoreBtn.onInputOut.add(this.scoreOut, this);

	accountBtn = game.add.button(10, 10, 'account', this.viewProfile, this);
	accountBtn.scale.setTo(1.2, 1.2);
	accountBtn.onInputOver.add(this.accountOver, this);
	accountBtn.onInputOut.add(this.accountOut, this);

	difficultyBtn = game.add.button(startBtn.x + 15, startBtn.y + 45, 'difficulty', this.changeDifficulty, this);
	difficultyBtn.scale.setTo(.8, .8);
	var style = { font: "Lucida Console", fontSize: "18px", wordWrap: false, align: "center", fontWeight: "bold" };
	difficultyText = game.add.text(difficultyBtn.x + 150, difficultyBtn.y + 8, "Difficulty: easy", style);

	logoutBtn = game.add.button(0, 0, 'login', this.logOut, this);
	logoutBtn.scale.setTo(1.2, 1.2);
	logoutBtn.x = game.world.centerX - (logoutBtn.width / 2);
	logoutBtn.y = game.world.centerY - (logoutBtn.height / 2) + 240;
}

Menu.showDifficulty = function() {
	difficultyText.setText("Difficulty: " + difficulty);
}

Menu.changeDifficulty = function() {
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
	this.showDifficulty();
}

Menu.startGame = function() {
	game.state.start('Select');
}

Menu.viewScore = function() {
	game.stage.backgroundColor = '#00ff00';
	game.state.start('HighScores');
}

Menu.logOut = function() {
	game.state.start('Login');
}

Menu.viewProfile = function() {
	game.stage.backgroundColor = '#0000ff';
	game.state.start('Account');
}

Menu.startOver = function() {
	startBtn.loadTexture('startActive');
}

Menu.startOut = function() {
	startBtn.loadTexture('start');
}

Menu.scoreOver = function() {
	scoreBtn.loadTexture('scoreActive');
}

Menu.scoreOut = function() {
	scoreBtn.loadTexture('score');
}

Menu.accountOver = function() {
	accountBtn.loadTexture('accountActive');
}

Menu.accountOut = function() {
	accountBtn.loadTexture('account');
}
