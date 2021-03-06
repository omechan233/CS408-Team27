var game = new Phaser.Game(
    window.innerWidth * 0.95, 
    window.innerHeight * 0.95, 
    Phaser.GRAPHICS, 
    document.getElementById('app'), 
    this, false, false);

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(1, 1);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

	game.state.add('Login', Login);
	game.state.add('SignUp', SignUp);
	game.state.add('Menu', Menu);
	game.state.add('Account', Account);
	game.state.add('HighScores', HighScores);
	game.state.add('Gameplay', Gameplay);
	game.state.add('Select', Select);
	game.smoothed = false;
	game.state.start('Login');
}
