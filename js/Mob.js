Mob = function(game) {
	this.game = game;
    var multiplier = 1;
    if (difficulty === "easy") {
        multiplier = 1;
    } else if (difficulty === "medium") {
        multiplier = 1.5;
    } else if (difficulty === "hard") {
        multiplier = 2;
    }
	this.health = 50 * multiplier;
	this.isInvincible = false;
	this.stunned = false;
	this.invincibleTime = 0;
	this.x = game.rnd.integerInRange(0, game.world._width);
	this.y = game.rnd.integerInRange(0, game.world._height);
	this.sprite = game.add.sprite(this.x, this.y, 'player');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale.setTo(2, 2);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.stopVelocityOnCollide = true;	
	this.sprite.body.collideWorldBounds = true;
	this.canAttack = true;
	this.attackCoolDown = 1150;
}

Mob.prototype.update = function() {
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
		Gameplay.getPlayer().damage(dmg);
		this.canAttack = false;
		this.game.time.events.add(this.attackCoolDown, this.letAttack, this);
	}
}

Mob.prototype.letAttack = function() {
	this.canAttack = true;
}

Mob.prototype.damage = function(dmg, invinTime, stun) {
	if (!this.isInvincible) {
		this.isInvincible = true;
		this.health -= dmg;
		if (this.health > 0) {
			this.game.time.events.add(invinTime, this.stopInvincible, this);
			if (stun) {
				this.stun(invinTime * 1.5);
			}
		}
	}
}

Mob.prototype.stun = function(time) {
	this.stunned = true;
	this.stop();
	this.sprite.alpha = .5;
	this.game.time.events.add(time, this.stopStun, this);
}

Mob.prototype.stopStun = function() {
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
