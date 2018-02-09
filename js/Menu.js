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
	startBtn = game.add.button(0, 0, 'start', startGame, this);
	startBtn.scale.setTo(1.2, 1.2);
	startBtn.x = game.world.centerX - (startBtn.width / 2);
	startBtn.y = game.world.centerY - (startBtn.height / 2) + 40;
	startBtn.onInputOver.add(startOver, this);
	startBtn.onInputOut.add(startOut, this);

	scoreBtn = game.add.button(0, 0, 'login', viewScore, this);
	scoreBtn.scale.setTo(1.2, 1.2);
	scoreBtn.x = game.world.centerX - (scoreBtn.width / 2);
	scoreBtn.y = game.world.centerY - (scoreBtn.height / 2) + 120;
	scoreBtn.onInputOver.add(scoreOver, this);
	scoreBtn.onInputOut.add(scoreOut, this);

	accountBtn = game.add.button(10, 10, 'account', viewProfile, this);
	accountBtn.scale.setTo(1.2, 1.2);
	accountBtn.onInputOver.add(accountOver, this);
	accountBtn.onInputOut.add(accountOut, this);
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
	startBtn.loadTexture('startActive');
}

function startOut() {
	startBtn.loadTexture('start');
}

// End potential bug

function scoreOver() {
	scoreBtn.loadTexture('loginActive');
}

function scoreOut() {
	scoreBtn.loadTexture('login');
}

function accountOver() {
	accountBtn.loadTexture('accountActive');
}

function accountOut() {
	accountBtn.loadTexture('account');
}
