var Gameplay = {};

Gameplay.preload = function() {
	game.load.image('player', 'assets/Player.png');
	game.load.tilemap('test', 'assets/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 'assets/testtiles.png');
	game.load.image('paused', 'assets/pause.png');
	game.load.image('quit', 'assets/login.png');
	game.load.image('quitActive', 'assets/login_select.png');
}

var map;
var layer;
var playerSprite;
var mobs = [];
var paused = false;
var text;
var style;

Gameplay.create = function() {
	map = game.add.tilemap('test');
	map.addTilesetImage('testworld', 'testtiles');
	layer = map.createLayer("Tile Layer 1");
	layer.resizeWorld();
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	style = { font: "Lucida Console", fontSize: "64px", fill: "#ffffff", wordWrap: false, align: "center", fontWeight: "bold" };

	// M to spawn a mob
	spawnMobKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
	spawnMobKey.onDown.add(() => {
	//	new MobBadGuy(this);
		mobs.push(new Mob(this));	
	});

	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	pauseKey.onDown.add(this.pauseUnpause);

	playerSprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
	playerSprite.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(playerSprite);
	playerSprite.scale.setTo(2, 2);
	playerSprite.body.immovable = true;
}

Gameplay.update = function() {
	if (!paused) {
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].update();
		}
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
}

Gameplay.getPlayer = function() {
	return playerSprite;
}

Gameplay.pauseUnpause = function() {
	paused = !paused;
	if (paused) {
		pauseLayer = game.add.sprite(game.camera.x, game.camera.y, 'paused');
		pauseLayer.width = game.camera.width;
		pauseLayer.height = game.camera.height;
		text = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, "PAUSED", style); 
		text.anchor.setTo(0.5, 0.5);
		quitBtn = game.add.button(0, game.camera.y + game.camera.height / 2 + 80, 'quit', quitGame, this)
		quitBtn.x = game.camera.x + game.camera.width / 2 - quitBtn.width / 2
		quitBtn.onInputOver.add(quitOver, this);
		quitBtn.onInputOut.add(quitOut, this);

		for (var i = 0; i < mobs.length; i++) {
			mobs[i].stop();
		}
	}
	else {
		pauseLayer.destroy();
		text.destroy();
		quitBtn.destroy();
	}
}

function quitGame() {
	game.state.start('Menu', true, false);
}

function quitOver() {
	quitBtn.loadTexture('quitActive');
}

function quitOut() {
	quitBtn.loadTexture('quit');
}
