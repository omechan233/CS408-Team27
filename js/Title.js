var Title = {};

Title.preload = function() {
	game.load.image('background', 'assets/Test.png')
}

Title.create = function() {
	var background = game.add.sprite(0, 0, 'background');
	background.height = game.height;
	background.width = game.width;
	game.stage.backgroundColor = '#2a93c7';
	button = game.add.button(game.world.centerX - 25, game.world.centerY, 'fwgeh', goToLogin, this);
}

function goToLogin() {
	game.state.start('Login');
}
