var Gameplay = {};

Gameplay.preload = function() {
	game.load.image('player', 'assets/Player.png');
	game.load.tilemap('test', 'assets/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 'assets/testtiles.png');
}

var map;
var layer;
var playerSprite;

Gameplay.create = function() {
	map = game.add.tilemap('test');
	map.addTilesetImage('testworld', 'testtiles');
	layer = map.createLayer("Tile Layer 1");
	layer.resizeWorld();
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	// M to spawn a mob
	spawnMobKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
	spawnMobKey.onDown.add(() => {
		new MobBadGuy(this);
	});

	playerSprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
	game.debug.body(playerSprite);
	playerSprite.scale.setTo(2, 2);
}

Gameplay.update = function() {
	if (upKey.isDown) {
		if (playerSprite.y <= game.camera.y + game.camera.height / 2) {
			game.camera.y-=5;
		}
		playerSprite.y-=5;
	}
	else if (downKey.isDown) {
		if (playerSprite.y >= game.camera.y + game.camera.height / 2) {
			game.camera.y+=5;
		}
		playerSprite.y+=5;
	}

	if (leftKey.isDown) {
		if (playerSprite.x <= game.camera.x + game.camera.width / 2) {
			game.camera.x-=5;
		}
		playerSprite.x-=5;
	}
	else if (rightKey.isDown) {
		if (playerSprite.x >= game.camera.x + game.camera.width / 2) {
			game.camera.x+=5;
		}
		playerSprite.x+=5;
	}
}
