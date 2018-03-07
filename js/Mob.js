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
	this.x = game.rnd.integerInRange(0, game.world._width);
	this.y = game.rnd.integerInRange(0, game.world._height);
	this.sprite = game.add.sprite(this.x, this.y, 'player');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale.setTo(2, 2);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.stopVelocityOnCollide = true;	
	this.sprite.body.collideWorldBounds = true;

	this.attackCoolDown = 1150;
	this.timeSinceLastAttack = 0;
	this.lastAttackTime = 0;
	this.pausedTime = 0;
}

Mob.prototype.update = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.timeSinceLastAttack = new Date().getTime() - this.pausedTime - this.lastAttackTime;
	this.followPlayer();
}

Mob.prototype.followPlayer = function() {
	playerSprite = Gameplay.getPlayer();
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
	if (this.timeSinceLastAttack >= this.attackCoolDown) {
		this.lastAttackTime = new Date().getTime(); 
		Gameplay.player().damage(dmg);
		this.pausedTime = 0;
	}
}

Mob.prototype.damage = function(dmg) {
	this.health -= dmg;
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
