var Login = {};

Login.preload = function() {
    game.load.spritesheet('login', 'assets/login.png');
    game.load.spritesheet('signup', 'assets/signup.png');
}

Login.create = function() {
    game.stage.backgroundColor = '#292c30';
    
    game.add.sprite(game.world.centerX - 350, game.world.centerY + 50, 'login');
    button = game.add.button(game.world.centerX - 350, game.world.centerY, + 50, 'login', logIn, this);
    
    game.add.sprite(game.world.centerX + 200, game.world.centerY + 50, 'signup');
    button = game.add.button(game.world.centerX + 200, game.world.centerY + 50, 'signup', logIn, this);
}

function logIn() {
	game.state.start('Menu');
}