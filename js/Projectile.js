Projectile = function(game, startX, startY, xVel, yVel, theta, damage, type) {
	this.game = game;
	this.damage = damage;
	this.x = startX;
	this.y = startY;
	this.sprite = game.add.sprite(this.x, this.y, type);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.anchor.setTo(0.5, 0.5);
	console.log(theta);
	this.sprite.angle += theta;
	this.xVel = xVel;
	this.yVel = yVel;
	this.sprite.checkWorldBounds = true;
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
	return !this.sprite.inWorld;
}

Projectile.prototype.destroy = function() {
	console.log("destroyed");
	this.sprite.destroy();
}
