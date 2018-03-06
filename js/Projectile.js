Projectile = function(game, startX, startY, xVel, yVel, damage, type) {
	this.game = game;
	this.damage = damage
	this.sprite = game.add.sprite(this.startX, this.startY, type);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.anchor.setTo(0.5, 0.5);
	this.xVel = xVel;
	this.yVel = yVel;
	this.sprite.checkWorldBounds = true;
	this.sprite.events.onOutOfBounds.add(this.setOutOfBounds);
	this.oOB = false;
}

Projectile.prototype.update = function() {
	this.stop();
	this.start();
}

Projectile.prototype.start = function() {
	this.sprite.body.velocity.x = this.xVel;
	this.sprite.body.velocity.y = this.yVel;
}

Projectile.prototype.stop = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
}

Projectile.prototype.outOfBounds = function() {
	return this.oOB;
}

Projectile.prototype.setOutOfBounds = function() {
	this.stop();
	this.oOB = true;
}

Projectile.prototype.destroy = function() {
	this.sprite.destroy();
}
