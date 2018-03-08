/*
 *
 *  TODO:
 *  Fix directional combat to use mouse positions relative to player, rather than window
 *
 */

Player = function(game, weaponAsset) {

	this.game = game;
	
	this.health = 100;
	this.isAttacking = false;
	this.invincibleLength = 900;
	this.invincibleStart = 0;
	this.pausedTime = 0;
	
	this.sprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
	this.sprite.anchor.setTo(0.5, 0.5);

	this.weapon = this.sprite.addChild(game.make.sprite(this.sprite.width / 4, 0, weaponAsset));
	this.weapon.anchor.setTo(0.5, 1);
	this.weapon.scale.setTo(1.5, 1.5);

	this.game.physics.arcade.enable(this.sprite);

	// melee
	this.swing = this.game.add.group();
	this.swing.enableBody = true;
	this.swing.physicsBodyType = Phaser.Physics.ARCADE;
}

Player.prototype.create = function() {
}

Player.prototype.update = function() {
	console.log(this.weapon.height);
	if (this.sprite.alpha == 1 && this.timeSinceLastDamage() <= this.invincibleLength - 300) {
		this.sprite.alpha = .5;
	}
	
	else if (this.sprite.alpha < 1 && this.timeSinceLastDamage() > this.invincibleLength - 300) {
		this.sprite.alpha = 1;
	}
	
	this.stop();
	this.pointWeapon();
}

Player.prototype.attack = function() {
	if (this.isAttacking)
		return;

	this.isAttacking = true;

	// get mouse quadrant position (based on player location)
	mpx = this.game.input.mousePointer.x;
	mpy = this.game.input.mousePointer.y;
	// window center
	wCenter = {x: window.innerWidth / 2, y: window.innerHeight / 2}
	slope = window.innerHeight / window.innerWidth;

	quadrant = calculateQuadrant(mpx, mpy, slope);

	xOff = 0, yOff = 0, dirX = 1, dirY = 1, rot = 0;

	switch (quadrant) {
		case "north":
			yOff = -40;
			dirY = 1;
			rot = 270;
			break;
		case "east":
			xOff = 30;
			dirX = 1;
			break;
		case "south":
			yOff = 40;
			dirY = -1;
			rot = 90;
			break;
		case "west":
			xOff = -30;
			dirX = -1;
			break;
	}

	slashfx = this.game.add.sprite(this.sprite.x + xOff, this.sprite.y + yOff, 'slashfx');
	slashfx.angle = rot;
	slashfx.anchor.setTo(0.5, 0.5);
	slashfx.scale.setTo(2 * dirX, 2);

	slashBox = this.swing.create(this.sprite.x + xOff, this.sprite.y + yOff);
	slashBox.angle = rot;
	slashBox.anchor.setTo(0.5, 0.5);
	slashBox.scale.setTo(2 * dirX, 2);
	slashBox.enableBody = true;

	this.game.time.events.add(100, this.stopAttack, this);
}

Player.prototype.up = function() {
	this.sprite.body.velocity.y = -200;
}

Player.prototype.down = function() {
	this.sprite.body.velocity.y = 200;
}

Player.prototype.right = function() {
	this.sprite.body.velocity.x = 200;
}

Player.prototype.left = function() {
	this.sprite.body.velocity.x = -200;
}

Player.prototype.stop = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
}

Player.prototype.setPauseTime = function(pauseTime) {
	this.pausedTime = pauseTime;
}

Player.prototype.damage = function(dmg) {
	if (!this.isInvincible()) {
		this.health -= dmg;
		this.invincibleStart = new Date().getTime();
		this.setPauseTime(0);
	}
}

Player.prototype.isInvincible = function() {
	if (this.timeSinceLastDamage() <= this.invincibleLength) {
		return true;
	}
	return false;
}

Player.prototype.timeSinceLastDamage = function() {
	return new Date().getTime() - this.pausedTime - this.invincibleStart;
}

Player.prototype.isAlive = function() {
	if (this.health > 0) {
		return true;
	}
	return false;
}

Player.prototype.stopAttack = function() {
	this.isAttacking = false;
	this.swing.remove(slashBox);
	slashfx.kill();
	slashBox.kill();
}

Player.prototype.switchWeapon = function(newWeaponAsset) {
	this.weapon.loadTexture(newWeaponAsset);
}

Player.prototype.pointWeapon = function() {
	magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
	unitX = (target.x - playerSprite.x) / magnitude;	
	unitY = (target.y - playerSprite.y) / magnitude;
	theta = Math.acos(unitX);
	theta = theta * 180 / Math.PI;
	if (Math.asin(unitY) < 0) {
		theta = -theta;
	}
	this.weapon.angle = theta + 90;	
}

function calculateQuadrant(mpx, mpy, slope) {

	// calculate correct mouse location (y is flipped)
	b = window.innerHeight;
	mpy = b - mpy;

	// north or west quadrant
	if (mpy > slope * mpx) {
		return mpy > (-slope * mpx + b) ? "north" : "west";
	}
	// south or east quadrant
	else {
		return mpy > (-slope * mpx + b) ? "east" : "south";
	}

}
