var Menu = {};

Menu.preload = function() {
	game.load.image('background', 		'assets/background.png');
    game.load.spritesheet('title', 'assets/title_text.png');
	game.load.image('start', 			'assets/menu/start.png');
	game.load.image('startActive', 		'assets/menu/start_select.png');
	game.load.image('account', 			'assets/menu/account.png');
	game.load.image('accountActive', 	'assets/menu/account_select.png');
	game.load.image('score', 			'assets/menu/scores.png');
	game.load.image('scoreActive', 		'assets/menu/scores_select.png');
	game.load.image('difficulty', 		'assets/menu/difficulty.png');
	game.load.image('difficultyActive', 'assets/menu/difficulty_select.png');
	game.load.image('logout', 			'assets/menu/logout.png');
	game.load.image('logoutActive', 	'assets/menu/logout_select.png');
	game.load.audio('menuMusic', 		['assets/bgm/title.mp3', 'assets/bgm/title.ogg']);
}

var difficulty = "easy";

Menu.create = function() {
	background = game.add.sprite(0, 0, 'background', this);
	background.width = game.camera.width;
	background.height = game.camera.height;
	game.world.width = game.camera.width;
	game.world.height = game.camera.height;
    
    titleSprite = game.add.sprite(game.world.centerX, game.world.centerY - 100, 'title');
    
    titleSprite.anchor.setTo(0.5 , 0.5);

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
	difficultyBtn.scale.setTo(.9, .9);	
	difficultyBtn.onInputOver.add(this.difficultyOver, this);
	difficultyBtn.onInputOut.add(this.difficultyOut, this);

	var style = { font: "Lucida Console", fontSize: "18px", wordWrap: false, align: "center", fontWeight: "bold", fill: "#ffffff" };
	difficultyText = game.add.text(difficultyBtn.x + 275, difficultyBtn.y  + 5 + difficultyBtn.height / 2, "Difficulty: easy", style);
	difficultyText.anchor.setTo(0, 0.5);

	logoutBtn = game.add.button(0, 0, 'logout', this.logOut, this);
	logoutBtn.onInputOver.add(this.logoutOver, this);
	logoutBtn.onInputOut.add(this.logoutOut, this);
	logoutBtn.scale.setTo(1.2, 1.2);
	logoutBtn.x = game.world.centerX - (logoutBtn.width / 2);
	logoutBtn.y = game.world.centerY - (logoutBtn.height / 2) + 240;

	music = game.sound.play('menuMusic');
}

Menu.showDifficulty = function() {
	difficultyText.setText("Difficulty: " + difficulty);
}

Menu.changeDifficulty = function() {
    if (difficulty == "easy") {
        difficulty = "medium";
    } else if (difficulty == "medium") {
        difficulty = "hard";
    }
	this.showDifficulty();
}

Menu.startGame = function() {
	music.stop();
	game.state.clearCurrentState();
	game.state.start('Select');
}

Menu.viewScore = function() {
	music.stop();
	game.state.clearCurrentState();
	game.state.start('HighScores');
}

Menu.logOut = function() {
	music.stop();
	game.state.clearCurrentState();
	game.state.start('Login');
}

Menu.viewProfile = function() {
	music.stop();
	game.state.clearCurrentState();
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

Menu.accountOut = function() {}

Menu.difficultyOver = function() {
	difficultyBtn.loadTexture('difficultyActive');
}

Menu.difficultyOut = function() {
	difficultyBtn.loadTexture('difficulty');
}

Menu.logoutOver = function() {
	logoutBtn.loadTexture('logoutActive');
}

Menu.logoutOut = function() {
	logoutBtn.loadTexture('logout');
}
