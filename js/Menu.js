var Menu = {};

Menu.create = function() {
	game.stage.backgroundColor = '#2a93c7';
	button = game.add.button(game.world.centerX - 25, game.world.centerY, 'fwgeh', startGame, this);
	button = game.add.button(game.world.centerX - 25, game.world.centerY + 30, 'feywu', viewScore, this);
	button = game.add.button(game.world.centerX - 25, game.world.centerY - 30, 'uwyfg', viewProfile, this);
}

function startGame() {
	game.stage.backgroundColor = '#52b5d2';
}

function viewScore() {
	game.stage.backgroundColor = '#32d598';
}

function viewProfile() {
	game.stage.backgroundColor = '#d57233';
}
