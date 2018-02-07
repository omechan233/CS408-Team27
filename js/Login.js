var Login = {};

Login.preload = function() {
    game.load.spritesheet('login', 'assets/login.png');
    game.load.spritesheet('signup', 'assets/signup.png');
}

Login.create = function() {
    // Create Background
    game.stage.backgroundColor = '#292c30';
    
    // Add in sprites from spritesheet
    game.add.sprite(game.world.centerX - 350, game.world.centerY + 50, 'login');

    game.add.sprite(game.world.centerX + 200, game.world.centerY + 50, 'signup');
    
    // Build buttons on top of sprites
    loginButton = game.add.button(game.world.centerX - 350, game.world.centerY + 50, 'login', logIn, this);
    
    signupButton = game.add.button(game.world.centerX + 200, game.world.centerY + 50, 'signup', logIn, this);
}

function logIn() {
	game.state.start('Menu');
}