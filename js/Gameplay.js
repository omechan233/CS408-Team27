var Gameplay = {};

Gameplay.preload = function() {
	game.load.image('player', 'assets/sprites/Player.png');
	game.load.image('slashfx', 'assets/sprites/gray_bannan.png');
	game.load.image('dead', 'assets/sprites/dead.png');
	game.load.image('target', 'assets/sprites/target.png');
	game.load.image('crowbar', 'assets/sprites/crowbar.png');
	game.load.image('pipe', 'assets/sprites/pipe.png');
	game.load.image('heavySword', 'assets/sprites/sword_heavy.png');
	game.load.image('lightSword', 'assets/sprites/sword_light.png');
	game.load.image('lance', 'assets/sprites/lance.png');
	game.load.image('m16', 'assets/sprites/m16.png');
	game.load.image('deagle', 'assets/sprites/deagle.png');
	game.load.image('crossbow', 'assets/sprites/crossbow.png');
	game.load.image('arrow', 'assets/sprites/arrow.png');
	game.load.image('bullet', 'assets/sprites/bullet.png');


	game.load.tilemap('test', 'assets/maps/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 	'assets/maps/testtiles.png');

	game.load.image('quit', 'assets/menu/login.png');
	game.load.image('quitActive', 'assets/menu/login_select.png');

	game.load.image('paused', 'assets/pause.png');
	game.load.image('gameOver', 'assets/gameOver.png');


	this.state.paused = false;
	this.state.gameover = false;
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

	mobs = [];
	mobProjectiles = [];
	playerProjectiles = [];

	// M to spawn a mob
	spawnMobKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
	spawnMobKey.onDown.add(() => {
			mobs.push(new MobBadGuy(this));	
			});

	tempKey.onDown.add(() => {
			mobProjectiles.push(new Projectile(this, 500, 500, -100, -100, 0, 10, 'login'));	
			});

	shootKey.onDown.add(() =>  {
			//	magnitude = Math.sqrt(Math.pow(game.input.mousePointer.x - playerSprite.x, 2) + Math.pow(game.input.mousePointer.y - playerSprite.y, 2));
		if (!this.state.paused) {
			magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
			unitX = (target.x - playerSprite.x) / magnitude;	
			unitY = (target.y - playerSprite.y) / magnitude;
			theta = Math.acos(unitX);
			theta = theta * 180 / Math.PI;
		if (Math.asin(unitY) < 0) {
			theta = -theta;
		}
		type = game.rnd.integerInRange(1, 3);
		switch(type) {
			case 0:
				playerProjectiles.push(new Projectile(this, playerSprite.x, playerSprite.y, 100 * unitX, 100 * unitY, theta, 10, 'login'));	
				break;
			case 1:
				temp = new Projectile(this, playerSprite.x, playerSprite.y, 300 * unitX, 300 * unitY, theta, 10, 'arrow');
				temp.sprite.body.setSize(temp.sprite.width, temp.sprite.width, 0, -temp.sprite.width/2);
				temp.sprite.scale.setTo(2, 2);
				playerProjectiles.push(temp);
				break;
			case 3:
				temp = new Projectile(this, playerSprite.x, playerSprite.y, 500 * unitX, 500 * unitY, theta, 10, 'bullet');
				temp.sprite.scale.setTo(2, 2);
				playerProjectiles.push(temp);
				break;
			}
		}
	});

	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
	pauseKey.onDown.add(() => {
		if (!this.state.gameover) {
			this.pauseUnpause();
		}
	});
	killKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
	superSpawnKey = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

	killKey.onDown.add(() => {
		player.health = 0;	
	});

	superSpawnKey.onDown.add(() => {
		for (var i = 0; i < 500; i++) {
			mobs.push(new MobBadGuy(this));	
		}
	});

	player = new Player(this);
	playerSprite = player.sprite;
	playerSprite.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(playerSprite);
	playerSprite.scale.setTo(2, 2);
	playerSprite.body.immovable = true;
	playerSprite.body.collideWorldBounds = true;

	game.input.onDown.add(() => {
		if (!this.state.paused) {
			player.attack();
		}
	});

	cursors = game.input.keyboard.createCursorKeys();

	scoreStyle = { font: "Lucida Console", fontSize: "24px", fill: "#000000", wordWrap: false, fontWeight: "bold" };
	scoreText = game.add.text(game.camera.width, 0, "000000", scoreStyle);
	scoreText.fixedToCamera = true;
	scoreText.anchor.setTo(1, 0);

	target = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'target');
	target.anchor.setTo(0.5, 0.5);
	target.scale.setTo(2, 2);


	score = 0;
	pauseElapsedTime = 0;

	game.camera.follow(playerSprite);
}

Gameplay.update = function() {
	this.movePointer();
	if (!this.state.paused) {
		if (!player.isAlive()) {
			this.gameOver();
		}
		player.update();
		for (var i = mobs.length - 1; i >= 0; i--) {
			mobs[i].update();
			if (game.physics.arcade.overlap(player.swing.children[0], mobs[i].sprite)) {
				player.swing.children[0].kill();
				mobs[i].health = 0;
			}
			for (var j = playerProjectiles.length - 1; j >= 0; j--) {
				if (game.physics.arcade.overlap(playerProjectiles[j].sprite, mobs[i].sprite)) {
					mobs[i].damage(playerProjectiles[j].getDamage());
					playerProjectiles[j].destroy();
					playerProjectiles.splice(j, 1);
				}
			}

			if (!mobs[i].isAlive()) {
				mobs[i].destroy();
				mobs.splice(i, 1);
				score++;
			}
		}

		for (var i = playerProjectiles.length - 1; i >= 0; i--) {
			playerProjectiles[i].update();
			if (playerProjectiles[i].outOfBounds()) {
				playerProjectiles[i].destroy();
				playerProjectiles.splice(i, 1);
			}
		}

		for (var i = mobProjectiles.length - 1; i >= 0; i--) {
			mobProjectiles[i].update();
			remove = false;
			if (game.physics.arcade.overlap(mobProjectiles[i].sprite, player.sprite)) {
				player.damage(mobProjectiles[i].getDamage());
				player.sprite.position.x += 10;
				remove = true;
			}
			if (mobProjectiles[i].outOfBounds() || remove == true) {
				mobProjectiles[i].destroy();
				mobProjectiles.splice(i, 1);
			}
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
	else {
		player.stop();
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
	this.state.gameover = true;
	player.stop();
	for (var i = 0; i < mobs.length; i++) {
		mobs[i].stop();
	}

	gameOverLayer = game.add.sprite(game.camera.x - 50, game.camera.y - 50, 'gameOver');
	gameOverLayer.width = game.camera.width + 100;
	gameOverLayer.height = game.camera.height + 100;
	gameOverLayer.alpha = 0;
	game.add.tween(gameOverLayer).to( { alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
	skull = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'dead');
	skull.scale.setTo(3, 3);
	skull.anchor.setTo(0.5, 0.5);
	text = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2 - 150, "YOU HAVE DIED!\nGAME OVER", style); 
	text.anchor.setTo(0.5, 0.5);
	scoreText = game.add.text(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2 + 90, 'FINAL SCORE: ' + score, style);
	scoreText.anchor.setTo(0.5, 0.5);
	quitBtn = game.add.button(0, game.camera.y + game.camera.height / 2 + 120, 'quit', Gameplay.quitGame, this);
	quitBtn.scale.setTo(1.2, 1.2);
	quitBtn.x = game.camera.x + game.camera.width / 2 - quitBtn.width / 2;
	quitBtn.onInputOver.add(Gameplay.quitOver, this);
	quitBtn.onInputOut.add(Gameplay.quitOut, this);
}

Gameplay.getLastPausedTime = function() {
	return pauseElapsedTime;
}

Gameplay.quitGame = function() {
	game.state.start('Menu', true, false);
}

Gameplay.quitOver = function() {
	quitBtn.loadTexture('quitActive');
}

Gameplay.quitOut = function() {
	quitBtn.loadTexture('quit');
}

Gameplay.movePointer = function() {
	target.x = game.input.mousePointer.x + game.camera.x;
	target.y = game.input.mousePointer.y + game.camera.y;
}

Gameplay.lockPointer = function() {
	game.input.mouse.requestPointerLock();
}

Gameplay.unlockPointer = function() {
	game.input.mouse.releasePointerLock();
}

Gameplay.render = function() {
	/*for (var i = 0; i < playerProjectiles.length; i++) {
	  game.debug.body(playerProjectiles[i].sprite);
	  }*/
}
