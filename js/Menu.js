var Menu = {};

Menu.preload = function() {
	game.load.image('start', 'assets/start.png');
	game.load.image('startActive', 'assets/start_select.png');
	game.load.image('account', 'assets/account.png');
	game.load.image('accountActive', 'assets/account_select.png');
	game.load.image('login', 'assets/login.png');
	game.load.image('loginActive', 'assets/login_select.png');
}

Menu.create = function() {
	game.world.width = game.camera.width;
	game.world.height = game.camera.height;

	game.stage.backgroundColor = '#2a93c7';
	this.state.startBtn = game.add.button(0, 0, 'start', startGame, this);
	this.state.startBtn.scale.setTo(1.2, 1.2);
	this.state.startBtn.x = game.world.centerX - (startBtn.width / 2);
	this.state.startBtn.y = game.world.centerY - (startBtn.height / 2) + 40;
	this.state.startBtn.onInputOver.add(startOver, this);
	this.state.startBtn.onInputOut.add(startOut, this);

	this.state.scoreBtn = game.add.button(0, 0, 'login', viewScore, this);
	this.state.scoreBtn.scale.setTo(1.2, 1.2);
	this.state.scoreBtn.x = game.world.centerX - (scoreBtn.width / 2);
	this.state.scoreBtn.y = game.world.centerY - (scoreBtn.height / 2) + 120;
	this.state.scoreBtn.onInputOver.add(scoreOver, this);
	this.state.scoreBtn.onInputOut.add(scoreOut, this);

	this.state.accountBtn = game.add.button(10, 10, 'account', viewProfile, this);
	this.state.accountBtn.scale.setTo(1.2, 1.2);
	this.state.accountBtn.onInputOver.add(accountOver, this);
	this.state.accountBtn.onInputOut.add(accountOut, this);
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

function startOver() {
	this.state.startBtn.loadTexture('startActive');
}

function startOut() {
    console.log(this.state);
    console.log(this.state.startBtn);
	this.state.startBtn.loadTexture('start');
}

// End potential bug

function scoreOver() {
	this.state.scoreBtn.loadTexture('loginActive');
}

function scoreOut() {
	this.state.scoreBtn.loadTexture('login');
}

function accountOver() {
	this.state.accountBtn.loadTexture('accountActive');
}

function accountOut() {
	this.state.accountBtn.loadTexture('account');
}
