var Menu = {};

Menu.create = function() {
	game.stage.backgroundColor = '#2a93c7';
	button = game.add.button(game.world.centerX - 25, game.world.centerY, 'fwgeh', startGame, this);
	button = game.add.button(game.world.centerX - 25, game.world.centerY + 30, 'feywu', viewScore, this);
	button = game.add.button(game.world.centerX - 25, game.world.centerY - 30, 'uwyfg', viewProfile, this);
}

function startGame() {
	game.stage.backgroundColor = '#ff0000';
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
