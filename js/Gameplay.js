var Gameplay = {};

Gameplay.preload = function() {
	console.log("Game Start");
	game.load.tilemap('test', 'assets/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 'assets/testtiles.png');
}

var map;
var layer;

Gameplay.create = function() {
	map = game.add.tilemap('test');
	map.addTilesetImage('testworld', 'testtiles');
	layer = map.createLayer("Tile Layer 1");
	layer.resizeWorld();
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

Gameplay.update = function() {
	if (upKey.isDown) {
		game.camera.y-=5;
	}
	else if (downKey.isDown) {
		game.camera.y+=5;
	}

	if (leftKey.isDown) {
		game.camera.x-=5;
	}
	else if (rightKey.isDown) {
		game.camera.x+=5;
	}
}
