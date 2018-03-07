var Gameplay = {};

Gameplay.preload = function() {
	game.load.image('player', 'assets/Player.png');
	game.load.image('slashfx', 'assets/gray_bannan.png');
	game.load.tilemap('test', 'assets/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 'assets/testtiles.png');
	game.load.image('paused', 'assets/pause.png');
	game.load.image('quit', 'assets/login.png');
	game.load.image('quitActive', 'assets/login_select.png');
	game.load.image('dead', 'assets/dead.png');
	game.load.image('gameOver', 'assets/gameOver.png');
	game.load.image('target', 'assets/target.png');
	this.state.paused = false;
}

Gameplay.create = function() {
	map = game.add.tilemap('test');
	map.addTilesetImage('testworld', 'testtiles');
	layer = map.createLayer("Tile Layer 1");
	layer.resizeWorld();
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	tempKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	style = { font: "Lucida Console", fontSize: "64px", fill: "#ffffff", wordWrap: false, align: "center", fontWeight: "bold" };

	//game.canvas.addEventListener('mousedown', this.lockPointer);
	
	game.input.addMoveCallback(this.movePointer, this);

	// M to spawn a mob
	spawnMobKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
	spawnMobKey.onDown.add(() => {
		mobs.push(new MobBadGuy(this));	
	});

	tempKey.onDown.add(() => {
		mobProjectiles.push(new Projectile(this, 500, 500, -100, -100, 10, 'login'));	
	});

	shootKey.onDown.add(() =>  {
	//	magnitude = Math.sqrt(Math.pow(game.input.mousePointer.x - playerSprite.x, 2) + Math.pow(game.input.mousePointer.y - playerSprite.y, 2));
		magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
		unitX = (target.x - playerSprite.x) / magnitude;	
		unitY = (target.y - playerSprite.y) / magnitude;
		theta = Math.acos(unitX);
		theta = theta * 180 / Math.PI;
		if (Math.asin(unitY) < 0) {
			theta = -theta;
		}
		playerProjectiles.push(new Projectile(this, playerSprite.x, playerSprite.y, 100 * unitX, 100 * unitY, theta, 10, 'login'));	
	});

	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	pauseKey.onDown.add(this.pauseUnpause);

	player = new Player(this);
	playerSprite = player.sprite;
	playerSprite.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(playerSprite);
	playerSprite.scale.setTo(2, 2);
	playerSprite.body.immovable = true;
	playerSprite.body.collideWorldBounds = true;

	game.input.onDown.add(player.attack, player);

	cursors = game.input.keyboard.createCursorKeys();

	scoreStyle = { font: "Lucida Console", fontSize: "24px", fill: "#000000", wordWrap: false, fontWeight: "bold" };
	scoreText = game.add.text(game.camera.width, 0, "000000", scoreStyle);
	scoreText.fixedToCamera = true;
	scoreText.anchor.setTo(1, 0);

	target = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'target');
	target.anchor.setTo(0.5, 0.5);
	target.scale.setTo(2, 2);

	mobs = [];
	mobProjectiles = [];
	playerProjectiles = [];

	score = 0;
	pauseElapsedTime = 0;

	game.camera.follow(playerSprite);
}

Gameplay.update = function() {
	if (!this.state.paused) {
		if (!player.isAlive()) {
			this.gameOver();
		}

		player.update();
		
		deadMobs = [];
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].update();
			if (game.physics.arcade.overlap(player.swing.children[0], mobs[i].sprite)) {
				player.swing.children[0].kill();
				mobs[i].destroy();
				score++;
				deadMobs.push(i);
			}
		}
		for (var i = 0; i < deadMobs.length; i++) {
			mobs.splice(deadMobs[i], 1);
		}
		
		removedProjectiles = []
		for (var i = 0; i < mobProjectiles.length; i++) {
			mobProjectiles[i].update();
			if (mobProjectiles[i].outOfBounds()) {
				mobProjectiles[i].destroy();
				removedProjectiles.push(i);
			}
		}
		for (var i = 0; i < removedProjectiles.length; i++) {
			mobProjectiles.splice(removedProjectiles[i], 1);
		}
		
		removedProjectiles = [];
		for (var i = 0; i < playerProjectiles.length; i++) {
			playerProjectiles[i].update();
			if (playerProjectiles[i].outOfBounds()) {
				playerProjectiles[i].destroy();
				removedProjectiles.push(i);
			}
		}
		for (var i = 0; i < removedProjectiles.length; i++) {
			playerProjectiles.splice(removedProjectiles[i], 1);
		}

		if (cursors.up.isDown || upKey.isDown) {
			player.up();
		}
		else if (cursors.down.isDown || downKey.isDown) {
			player.down();
		}
		if (cursors.right.isDown || rightKey.isDown) {
			player.right();
		}
		else if (cursors.left.isDown || leftKey.isDown) {
			player.left();
		}

		this.updateScore();

	}
}

Gameplay.updateScore = function() {
	scoreText.setText("SCORE: " + score);
}

Gameplay.getPlayer = function() {
	return playerSprite;
}

Gameplay.player = function() {
	return player;
}

Gameplay.getMobs = function() {
	return mobs;
}

Gameplay.pauseUnpause = function() {
	this.state.paused = !this.state.paused;
	if (this.state.paused) {
		pauseStartTime = new Date().getTime();

		player.stop();
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].stop();
		}

		for (var i = 0; i < mobProjectiles.length; i++) {
			mobProjectiles[i].stop();
		}

		for (var i = 0; i < playerProjectiles.length; i++) {
			playerProjectiles[i].stop();
		}

		pauseLayer = game.add.sprite(game.camera.x, game.camera.y, 'paused');
		pauseLayer.width = game.camera.width;
		pauseLayer.height = game.camera.height;
		text = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, "PAUSED", style); 
		text.anchor.setTo(0.5, 0.5);
		quitBtn = game.add.button(0, game.camera.y + game.camera.height / 2 + 80, 'quit', Gameplay.quitGame, this);
		quitBtn.scale.setTo(1.2, 1.2);
		quitBtn.x = game.camera.x + game.camera.width / 2 - quitBtn.width / 2;
		quitBtn.onInputOver.add(Gameplay.quitOver, this);
		quitBtn.onInputOut.add(Gameplay.quitOut, this);

	}
	else {
		pauseLayer.destroy();
		text.destroy();
		quitBtn.destroy();
		pauseElapsedTime = new Date().getTime() - pauseStartTime;
		player.setPauseTime(pauseElapsedTime);
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].setPausedTime(pauseElapsedTime);
		}
	}
}

Gameplay.gameOver = function() {
	this.state.paused = true;
	player.stop();
	for (var i = 0; i < mobs.length; i++) {
		mobs[i].stop();
	}
	
	gameOverLayer = game.add.sprite(game.camera.x, game.camera.y, 'gameOver');
	gameOverLayer.width = game.camera.width;
	gameOverLayer.height = game.camera.height;
	gameOverLayer.alpha = 0;
	game.add.tween(gameOverLayer).to( { alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
	skull = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'dead');
	skull.scale.setTo(3, 3);
	skull.anchor.setTo(0.5, 0.5);
	text = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2 - 150, "YOU HAVE DIED!\nGAME OVER", style); 
	text.anchor.setTo(0.5, 0.5);
	quitBtn = game.add.button(0, game.camera.y + game.camera.height / 2 + 80, 'quit', Gameplay.quitGame, this);
	quitBtn.scale.setTo(1.2, 1.2);
	quitBtn.x = game.camera.x + game.camera.width / 2 - quitBtn.width / 2;
	quitBtn.onInputOver.add(Gameplay.quitOver, this);
	quitBtn.onInputOut.add(Gameplay.quitOut, this);
}

Gameplay.getLastPausedTime = function() {
	return pauseElapsedTime;
}

Gameplay.quitGame = function() {
	console.log("quit");
	game.state.start('Menu', true, false);
}

Gameplay.quitOver = function() {
	quitBtn.loadTexture('quitActive');
}

Gameplay.quitOut = function() {
	quitBtn.loadTexture('quit');
}

Gameplay.movePointer = function(pointer, x, y, click) {
	/*if (!this.state.paused && !click) {
		target.x += game.input.mouse.event.movementX;
		target.y += game.input.mouse.event.movementY;
	}*/
	target.x = game.input.mousePointer.x;
	target.y = game.input.mousePointer.y;
}

Gameplay.lockPointer = function() {
	game.input.mouse.requestPointerLock();
}

Gameplay.unlockPointer = function() {
	game.input.mouse.releasePointerLock();
}
