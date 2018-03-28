Mob = function(game, spriteKey, baseHealth) {
	this.game = game;
    var multiplier = 1;
    if (difficulty === "easy") {
        multiplier = 1;
    } else if (difficulty === "medium") {
        multiplier = 2;
    } else if (difficulty === "hard") {
        multiplier = 4;
    }
    this.maxHealth = baseHealth * multiplier;
	this.health = this.maxHealth;
	this.isInvincible = false;
	this.stunned = false;
	this.invincibleTime = 0;

	this.x = game.rnd.integerInRange(0, game.world._width);
	this.y = game.rnd.integerInRange(0, game.world._height);

	this.sprite = game.add.sprite(this.x, this.y, spriteKey);
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale.setTo(1.7, 1.7);

	// hp bar
	this.healthBarBack = this.sprite.addChild(
		game.make.sprite(0, -this.sprite.height / 4, 'xpbarback')
	);
	this.healthBarBack.width = this.sprite.width / 2;
	this.healthBarBack.x -= this.healthBarBack.width / 2;

	this.healthBarFront = this.healthBarBack.addChild(
		game.make.sprite(0, 0, 'xpbarfront')
	);
	this.healthBarFront.width = this.healthBarBack.width;
	this.healthBarFront.scale.setTo(1, 1);

	// mob animations
	this.animSpeed = 7;
	this.sprite.animations.add('stand', 	[0], 10, true, true);
	this.sprite.animations.add('walkdown', 	[0, 1, 2, 3], 10, true, true);
	this.sprite.animations.add('walkleft', 	[4, 5, 6, 7], 10, true, true);
	this.sprite.animations.add('walkright', [8, 9, 10, 11], 10, true, true);
	this.sprite.animations.add('walkup', 	[12, 13, 14, 15], 10, true, true);

	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.stopVelocityOnCollide = true;	
	this.sprite.body.collideWorldBounds = true;

	this.canAttack = true;
	this.attackCoolDown = 1150;

	this.attackSprite = game.make.sprite(0, 0, 'haunt');
	this.attackSprite.anchor.setTo(0.5, 0.5);

	this.stunSprite = game.make.sprite(0, 0, 'stun');
	this.stunSprite.anchor.setTo(0.5, 0.5);
	this.stunSprite.scale.setTo(1.25, 1.25);
}

Mob.prototype.update = function() {
	var velX = this.sprite.body.velocity.x;
	var velY = this.sprite.body.velocity.y;

	if (!velX && !velY) {
		// don't modify animation
	}
	// vertical animation
	else if (Math.abs(velY) > Math.abs(velX)) {
		anim = velY < 0 ? 'walkup' : 'walkdown';
		this.sprite.animations.play(anim, this.animSpeed, true);
	}
	// horizontal animation
	else {
		anim = velX < 0 ? 'walkleft' : 'walkright';
		this.sprite.animations.play(anim, this.animSpeed, true);
	}

	if (!this.stunned) {
		this.stop();
		this.followPlayer();
	}
}

Mob.prototype.followPlayer = function() {
	playerSprite = Gameplay.getPlayerSprite();
	let dist = game.physics.arcade.distanceBetween(this.sprite, playerSprite);
	if (dist < 1000 && !this.sprite.overlap(playerSprite)) {
		game.physics.arcade.moveToObject(this.sprite, playerSprite, 50);
	}
	else if (game.physics.arcade.collide(this.sprite.body, playerSprite) || this.sprite.overlap(playerSprite)) {
		this.melee(10);
	}
}

Mob.prototype.stop = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
}

Mob.prototype.melee = function(dmg) {
	if (this.canAttack) {
		this.sprite.addChild(this.attackSprite);
		Gameplay.getPlayer().damage(dmg);
		this.canAttack = false;
		this.game.time.events.add(this.attackCoolDown, this.letAttack, this);
		this.game.time.events.add(450, this.removeAttack, this);
	}
}

Mob.prototype.removeAttack = function() {
	this.sprite.removeChild(this.attackSprite);
}

Mob.prototype.letAttack = function() {
	this.canAttack = true;
}

Mob.prototype.damage = function(dmg, invinTime, stun, knockback) {
	if (!this.isInvincible) {
		if (invinTime > 0) {
			this.isInvincible = true;
		}
		this.health -= dmg;
		this.healthBarFront.scale.setTo(this.health / this.maxHealth, 1);
		if (this.health > 0) {
			if (invinTime > 0) {
				this.game.time.events.add(invinTime, this.stopInvincible, this);
			}
			if (stun) {
				this.stun(invinTime * 1.5);
			}
			if (knockback) {	
				playerSprite = Gameplay.getPlayerSprite();
				magnitude = Math.sqrt(Math.pow(this.sprite.x - playerSprite.x, 2) + Math.pow(this.sprite.y - playerSprite.y, 2));
				unitX = (this.sprite.x - playerSprite.x) / magnitude;
				unitY = (this.sprite.y - playerSprite.y) / magnitude;
				this.sprite.body.velocity.x = 35 * unitX;
				this.sprite.body.velocity.y = 35 * unitY;
			}
		}
	}
}

Mob.prototype.stun = function(time) {
	this.sprite.addChild(this.stunSprite);
	this.stunned = true;
	this.stop();
	this.sprite.alpha = .5;
	this.game.time.events.add(time, this.stopStun, this);
}

Mob.prototype.stopStun = function() {
	this.sprite.removeChild(this.stunSprite);
	this.sprite.alpha = 1;
	this.stunned = false;
}

Mob.prototype.stopInvincible = function() {
	this.isInvincible = false;
}

Mob.prototype.isAlive = function() {
	return this.health > 0;
}

Mob.prototype.setPausedTime = function(time) {
	this.pausedTime = time;
}

Mob.prototype.destroy = function() {
	this.sprite.destroy();
}
