var game = new Phaser.Game(500, 500, Phaser.AUTO, document.getElementById('app'), this, false, false);

game.state.add('Login', Login);
game.state.add('Menu', Menu);

game.state.start('Menu');
