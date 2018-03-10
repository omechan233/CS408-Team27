var Gameplay = {};

Gameplay.preload = function() {
	// Entities
	game.load.spritesheet('player', 'assets/sprites/test_character.png', 32, 48, 16);
	game.load.spritesheet('monster1', 'assets/sprites/monster-01.png', 32, 48, 16);
	game.load.spritesheet('monster2', 'assets/sprites/monster-02.png', 80, 96, 16);

	// HUD
	game.load.image('hpbarback', 'assets/sprites/HP_Bar.PNG');
	game.load.image('hpbarfront', 'assets/sprites/HP_Bar2.PNG');
	game.load.image('hpText', 'assets/sprites/HP_Tx.png');
	game.load.image('xpbarback', 'assets/sprites/Exp_Back.png');
	game.load.image('xpbarfront', 'assets/sprites/Exp_Meter.png');
	game.load.image('levelText', 'assets/sprites/Lv_Tx.PNG');
	game.load.image('specReady', 'assets/sprites/special_ready.png');

	// Special Effects & Weapons
	game.load.image('slashfx', 'assets/sprites/gray_bannan.png');
	game.load.image('dead', 'assets/sprites/dead.png');
	game.load.image('target', 'assets/sprites/target.png');
	game.load.image('crowbar', 'assets/sprites/crowbar.png');
	game.load.image('pipe', 'assets/sprites/pipe.png');
	game.load.image('sword', 'assets/sprites/sword.png');	
	game.load.image('heavySword', 'assets/sprites/sword_heavy.png');
	game.load.image('lightSword', 'assets/sprites/sword_light.png');
	game.load.image('lance', 'assets/sprites/lance.png');
	game.load.image('m16', 'assets/sprites/m16.png');
	game.load.image('deagle', 'assets/sprites/deagle.png');
	game.load.image('crossbow', 'assets/sprites/crossbow.png');
	game.load.image('arrow', 'assets/sprites/arrow.png');
	game.load.image('bullet', 'assets/sprites/bullet.png');

	// Game State
	game.load.image('quit', 'assets/menu/exit.png');
	game.load.image('quitActive', 'assets/menu/exit_select.png');
	game.load.image('paused', 'assets/pause.png');
	game.load.image('gameOver', 'assets/gameover.jpg');
	
	// Map Assets
	game.load.tilemap('test', 'assets/maps/Test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('testtiles', 'assets/maps/testtiles.png');

	// Forest Map Assets
	game.load.tilemap('forest1', 'assets/maps/forest_1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Woods1', 'assets/maps/002-Woods01.png');
	game.load.image('Water1', 'assets/maps/001-G_Water01.png');
	game.load.image('Tree1', 'assets/maps/036-Tree01.png');
	game.load.image('Tree2', 'assets/maps/037-Tree02.png');
	game.load.image('Road1', 'assets/maps/039-Road.png');
	
	this.state.paused = false;
	this.state.gameover = false;
}

var group;

Gameplay.create = function() {
	game.canvas.oncontextmenu = function (e) {
		e.preventDefault();
	}
	this.collisionLayers = [];
	switch (map) {
		case "Forest":
			map = game.add.tilemap('forest1');
			map.addTilesetImage('002-Woods01', 'Woods1');
			map.addTilesetImage('001-G_Water01', 'Water1');
			map.addTilesetImage('036-Tree01', 'Tree1');
			map.addTilesetImage('037-Tree02', 'Tree2');
			map.addTilesetImage('039-Road', 'Road1');
			map.createLayer("background_1").resizeWorld();
			map.createLayer("background_2").resizeWorld();
			map.createLayer("background_3").resizeWorld();
			blocked1 = map.createLayer("blocked_1")
			blocked2 = map.createLayer("blocked_2");
			blocked3 = map.createLayer("blocked_3");
			map.createLayer("foreground_1").resizeWorld();
			map.createLayer("foreground_2").resizeWorld();
			map.setCollisionBetween(1, 10000, true, blocked1);
			map.setCollisionBetween(1, 10000, true, blocked2);
			map.setCollisionBetween(1, 10000, true, blocked3);
			blocked1.resizeWorld();
			blocked2.resizeWorld();
			blocked3.resizeWorld();
			game.physics.arcade.enable(blocked1);
			game.physics.arcade.enable(blocked2);
			game.physics.arcade.enable(blocked3);
			this.collisionLayers.push(blocked1);
			this.collisionLayers.push(blocked2);
			this.collisionLayers.push(blocked3);
			break;
		case "Forest - 2":

			break;

		case "Desert": 

			break;
	}
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	tempKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	weaponKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
	style = { font: "Lucida Console", fontSize: "64px", fill: "#ffffff", wordWrap: false, align: "center", fontWeight: "bold" };

	mobs = [];
	mobProjectiles = [];
	playerProjectiles = [];

	weapon = 'sword';

	weaponKey.onDown.add(() => {
		switch(weapon) {
			case 'sword':
				player.switchWeapon('heavySword');
				weapon = 'heavySword';
				break;
			case 'heavySword':
				player.switchWeapon('lightSword');
				weapon = 'lightSword';
				break;
			case 'lightSword':
				player.switchWeapon('crowbar');
				weapon = 'crowbar';
				break;
			case 'crowbar':
				player.switchWeapon('pipe');
				weapon = 'pipe';
				break;
			case 'pipe':
				player.switchWeapon('lance');
				weapon = 'lance';
				break;
			case 'lance':
				player.switchWeapon('m16');
				weapon = 'm16';
				break;
			case 'm16':
				player.switchWeapon('deagle');
				weapon = 'deagle';
				break;
			case 'deagle':
				player.switchWeapon('crossbow');
				weapon = 'crossbow';
				break;
			case 'crossbow':
				player.switchWeapon('sword');
				weapon = 'sword'
				break;
		}	
	});

	// M or N to spawn a mob
	spawnGhost = game.input.keyboard.addKey(Phaser.Keyboard.M);
	spawnGhost.onDown.add(() => {
		mobs.push(new MobGhost(this));	
	});
	spawnBigGuy = game.input.keyboard.addKey(Phaser.Keyboard.N);
	spawnBigGuy.onDown.add(() => {
		mobs.push(new MobBigGuy(this));
	})

	tempKey.onDown.add(() => {
		mobProjectiles.push(new Projectile(this, 500, 500, -100, -100, 0, 10, 'login'));	
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
			mobs.push(new MobGhost(this));	
		}
	});

	player = new Player(this, 'sword');

	game.input.mouse.capture = true;
	
	cursors = game.input.keyboard.createCursorKeys();

	// Build HUD
	scoreStyle = { 
		font: "Lucida Console", 
		fontSize: "24px", 
		fill: "#000000", 
		wordWrap: false, 
		fontWeight: "bold",
	};
	scoreText = game.add.text(0, 0, "000000", scoreStyle);
	scoreText.x = game.camera.width / 2;
	scoreText.fixedToCamera = true;
	scoreText.anchor.setTo(0.5, 0);

	healthBarBack = game.add.image(game.camera.width - 10, 10, 'hpbarback');
	healthBarBack.fixedToCamera = true;
	healthBarBack.scale.setTo(3, 1);
	healthBarBack.anchor.setTo(1, 0);

	healthBarFront = game.add.image(healthBarBack.x - healthBarBack.width, 10, 'hpbarfront');
	healthBarFront.fixedToCamera = true;
	healthBarFront.scale.setTo(3, 1);
	healthBarFront.anchor.setTo(0, 0);

	healthText = game.add.image(healthBarFront.x - 8, 10, 'hpText');
	healthText.fixedToCamera = true;
	healthText.scale.setTo(1, 1);
	healthText.anchor.setTo(1, 0);

	xpBarBack = game.add.image(game.camera.width - 10, 30, 'xpbarback');
	xpBarBack.fixedToCamera = true;
	xpBarBack.scale.setTo(4, 1.5);
	xpBarBack.anchor.setTo(1, 0);

	xpBarFront = game.add.image(xpBarBack.x - xpBarBack.width, 30, 'xpbarfront');
	xpBarFront.fixedToCamera = true;
	xpBarFront.scale.setTo(4, 1.5);
	xpBarFront.anchor.setTo(0, 0);

	levelTextImage = game.add.image(xpBarFront.x - 30, 30, 'levelText');
	levelTextImage.fixedToCamera = true;
	levelTextImage.scale.setTo(1, 1);
	levelTextImage.anchor.setTo(1, 0);

	levelText = game.add.text(levelTextImage.x + 3, 25, player.level);
	levelText.fixedToCamera = true;
	levelText.scale.setTo(0.8, 0.8);
	levelText.anchor.setTo(0, 0);

	ammoTextCap = game.add.text(game.camera.width - 10, game.camera.height, '/ ' + player.ammoCapacity);
	ammoTextCap.fixedToCamera = true;
	ammoTextCap.anchor.setTo(1, 1);

	ammoTextRes = game.add.text(game.camera.width - 60, game.camera.height, player.ammoReserve);
	ammoTextRes.fixedToCamera = true;
	ammoTextRes.anchor.setTo(1, 1);

	specReady = game.add.image(game.camera.width - 10, game.camera.height - 40, 'specReady');
	specReady.fixedToCamera = true;
	specReady.scale.setTo(1.5, 1.5);
	specReady.anchor.setTo(1, 1);

	// HUD Group
	hudGroup = game.add.group();
	hudGroup.add(scoreText);
	hudGroup.add(healthBarBack);
	hudGroup.add(healthBarFront);
	hudGroup.add(healthText);
	hudGroup.add(xpBarBack);
	hudGroup.add(xpBarFront);
	hudGroup.add(levelTextImage);
	hudGroup.add(levelText);
	hudGroup.add(ammoTextCap);
	hudGroup.add(ammoTextRes);
	hudGroup.add(specReady);

	target = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'target');
	target.scale.setTo(2, 2);
	target.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    group = game.add.physicsGroup();
    var i = 0;
    for (i; i < 5; i++) {
//        game.add.sprite(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'player');
//        game.add.sprite(game.camera.x + game.camera.width / 2 + 100 + (i * 20), game.camera.y + game.camera.height / 2 + 100, 'player');
        
        var c = group.create(game.camera.x + game.camera.width / 2 + 100 + (i * 20), game.camera.y + game.camera.height / 2 + 100, 'heavySword', 10);
    }
    
	score = 0;
	pauseElapsedTime = 0;

	game.camera.follow(player.sprite);
}

Gameplay.update = function() {
	for (var i = 0; i < this.collisionLayers.length; i++) {
		game.physics.arcade.collide(player.sprite, this.collisionLayers[i]);
	}
	this.movePointer();
	if (!this.state.paused) {
		if (!player.isAlive()) {
			this.gameOver();
		}
		player.update();
        
		healthBarFront.scale.setTo(3 * (player.health / 100), 1);
		xpBarFront.scale.setTo(4 * ((player.xp % 100) / 100), 1.5);
		levelText.setText(player.level);
		ammoTextRes.setText(player.ammoReserve);
		specReady.alpha = player.canSpecial ? 1.0 : 0.2;
        
        if (game.physics.arcade.collide(player.sprite, group, this.collisionHandler, this.processHandler, this)) {
//            group.disabled = false;
//            var c = setInterval(function() {
//                group.disabled = true;
//                clearInterval(c);
//            }, 15000);
        }
		
		for (var i = mobs.length - 1; i >= 0; i--) {
			mobs[i].update();
			if (player.isAttacking) {
				player.hit(mobs[i]);

				if (game.physics.arcade.overlap(player.swing.children[0], mobs[i].sprite)) {
					player.swing.children[0].kill();
					mobs[i].health = 0;
				}
			}
			for (var j = player.projectiles.length - 1; j >= 0; j--) {
				if (game.physics.arcade.overlap(player.projectiles[j].sprite, mobs[i].sprite)) {
					mobs[i].damage(player.projectiles[j].getDamage(), 0, false, false);
					player.projectiles[j].destroy();
					player.projectiles.splice(j, 1);
				}
			}

			if (!mobs[i].isAlive()) {
				mobs[i].destroy();
				mobs.splice(i, 1);
				player.xp += 10;
				score++;
			}
		}

		for (var i = player.projectiles.length - 1; i >= 0; i--) {
			player.projectiles[i].update();
			if (player.projectiles[i].outOfBounds()) {
				player.projectiles[i].destroy();
				player.projectiles.splice(i, 1);
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
		if (!player.stunned) {
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
			player.normalizeSpeed();
		}
		this.updateScore();
		game.world.bringToTop(hudGroup);
	}
	else {
		player.stop();
	}
}

Gameplay.processHandler = function(player, item) {
    return true;
}

Gameplay.collisionHandler = function (play, item) {
    
    text = game.add.text(game.camera.width / 2 + 200, 100, '', {
            font: "65px Arial",
            fill: "#000000",
            align: "center"
    });
    
    text.anchor.setTo(1, 0);
    text.fixedToCamera = true;
    var powerUp = game.rnd.integerInRange(0, 5);
    switch(powerUp) {
        // Speed boost
        case 0:
            player.speedModifier = 2.00;
            text.setText("Speed Boost");
            var c = setInterval(function() {
                console.log("Resetting speed");
                player.speedModifier = 1.00;
                text.setText("");
                clearInterval(c);
            }, 15000);
            break;
            
        // Extra health
        case 1:
            player.health += 50;
            text.setText("Extra Health");
            var c = setInterval(function() {
                text.setText("");
                clearInterval(c);
            }, 5000);
            break;
            
        // Increased damage
        case 2:
            player.damageModifier = 1.5;
            text.setText("Extra Damage");
            var c = setInterval(function() {
                player.damageModifier = 1.00;
                text.setText("");
                clearInterval(c);
            }, 15000);
            break;
        
        // Decreased reload speed
        case 3:
            player.reloadTime = 250;
            text.setText("Faster Reload");
            var c = setInterval(function() {
                player.reloadTime = 500;
                text.setText("");
                clearInterval(c);
            }, 15000);
            break;
        
        // Infinite ammo
        case 4:
            player.reloadTime = 0;
            text.setText("Infinte Ammo");
            var c = setInterval(function() {
                player.reloadTime = 500;
                text.setText("");
                clearInterval(c);
            }, 7500);
            break;
            
        // Invincibility
        case 5:
            player.isInvincible = true;
            text.setText("Invincible");
            var c = setInterval(function() {
                player.isInvincible = false;
                text.setText("");
                clearInterval(c);
            }, 5000);
            break;
    }
    item.kill();
    var i = setInterval(function() {
        item.reset(item.x, item.y);
    }, 10000);
}

Gameplay.updateScore = function() {
	scoreText.setText("SCORE: " + score);
}

Gameplay.getPlayerSprite = function() {
	return player.sprite;
}

Gameplay.getPlayer = function() {
	return player;
}

Gameplay.getMobs = function() {
	return mobs;
}

Gameplay.pauseUnpause = function() {
	this.state.paused = !this.state.paused;
	if (this.state.paused) {
		game.time.events.pause();
		pauseStartTime = new Date().getTime();

		player.stop();
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].stop();
			mobs[i].sprite.animations.stop();
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
		game.time.events.resume();
		pauseLayer.destroy();
		text.destroy();
		quitBtn.destroy();
		pauseElapsedTime = new Date().getTime() - pauseStartTime;
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].setPausedTime(pauseElapsedTime);
		}
	}
}

Gameplay.gameOver = function() {
	socket = io.connect();
	this.state.paused = true;
	this.state.gameover = true;
	player.stop();
	for (var i = 0; i < mobs.length; i++) {
		mobs[i].stop();
	}
	socket.emit('postScore', score);

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

Gameplay.getTarget = function() {
	return target;
}

Gameplay.render = function() {
	/*for (var i = 0; i < playerProjectiles.length; i++) {
		game.debug.body(playerProjectiles[i].sprite);
	}
	
	for (var i = 0; i < mobs.length; i++) {
		game.debug.body(mobs[i].sprite);
	}
	game.debug.geom(player.tip, '#0000ff');
	game.debug.geom(player.base, '#0000ff');
	*/
//	game.debug.body(player.sprite);	
}
