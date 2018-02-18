var game = new Phaser.Game(window.innerWidth - 20, window.innerHeight - 20, 
    Phaser.AUTO, 
    document.getElementById('app'), 
    this, false, false);

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(1, 1);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

	game.state.add('Title', Title);
	game.state.add('Login', Login);
	game.state.add('SignUp', SignUp);
	game.state.add('Menu', Menu);
	game.state.add('Account', Account);
	game.state.add('HighScores', HighScores);
	game.state.add('Gameplay', Gameplay);

	game.smoothed = false;
	game.state.start('Login');
}
