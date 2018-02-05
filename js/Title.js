var Title = {};

Title.create = function() {
	game.stage.backgroundColor = '#2a93c7';
	button = game.add.button(game.world.centerX - 25, game.world.centerY, 'fwgeh', goToLogin, this);
}

function goToLogin() {
	game.state.start('Login');
}
