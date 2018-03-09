/*
 *
 *  TODO:
 *  Fix directional combat to use mouse positions relative to player, rather than window
 *
 */

Player = function(game, weaponAsset) {

	this.game = game;

	// Player Stats	
	this.health = 100;
	this.isAttacking = false;
	this.canAttack = true;
	this.attackCooldown = 100; 
	this.attackAnimationTime = 250;
	this.isInvincible = false;
	this.invincibleLength = 900;
	this.reloading = false;
	this.reloadTime = 500;
	this.stunned = false;
	this.lockTip = false;
	this.tipUnitX = 0;
	this.tipUnitY = 0;
	this.dmg = 10;
	this.ammoCapacity = 30;
	this.ammoReserve = 30;
	this.projectileVelocity = 300;
	this.resetX = 0;
	this.resetY = 0;

	/* Weapon Type 
	 * Used to determine type of attacks
	 * 0: Normal
	 * 1: Light
	 * 2: Heavy
	 * 3: Ranged
	 */
	this.weaponType = 0;
	this.changeWeaponType(weaponAsset);

	// The projectile texture
	this.projectileType = '';
	
	// Player Modifiers
	this.invincibleModifier = 1.0;
	this.attackSpeedModifer = 1.0;
 	this.speedModifier = 1.0;
	this.damageModifier = 1.0;

	// Player Sprite
	this.sprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this.sprite);
	
	// Weapon Sprite
	this.weapon = this.sprite.addChild(game.make.sprite(0, 0, weaponAsset));
	this.weapon.anchor.setTo(0.5, 1);
	this.weapon.scale.setTo(1.5, 1.5);
	this.weapon.pivot.x = 0;
	this.weapon.pivot.y = this.sprite.width / 5;
	this.game.physics.arcade.enable(this.weapon);
	this.tip = new Phaser.Point();
	this.base = new Phaser.Point();

	// melee
	this.swing = this.game.add.group();
	this.swing.enableBody = true;
	this.swing.physicsBodyType = Phaser.Physics.ARCADE;

	this.projectiles = [];
}

Player.prototype.create = function() {
}

Player.prototype.update = function() {
	this.findTip();
	if (!this.isAttacking) {
		this.pointWeapon();
	}
	if (!this.stunned) {
		this.stop();
		if (this.game.input.activePointer.leftButton.isDown && !this.isAttacking) {
			this.attack();
		}
		this.resetX = this.sprite.x;
		this.resetY = this.sprite.y;
	}
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

Player.prototype.attack = function() {
	if (this.isAttacking || !this.canAttack)
		return;

	this.isAttacking = true;
	switch(this.weaponType) {
		// Normal attack
		case 0:
			this.isInvincible = true;
			attackRangeTheta = 70;
			thetaPerMillis = attackRangeTheta / this.attackAnimationCooldown;
			thetaPerSec = thetaPerMillis * 1000;
			this.weapon.angle -= (this.attackAnimationCooldown * (thetaPerMillis)) / 2;
			this.weapon.body.angularVelocity = thetaPerSec;
			break;

		// Light Attack
		case 1:
			magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
			target = Gameplay.getTarget();
			unitX = (target.x - this.sprite.x) / magnitude;
			unitY = (target.y - this.sprite.y) / magnitude;
			theta = Math.acos(unitX);
			theta = theta * 180 / Math.PI;
			if (Math.asin(unitY) < 0) {
				theta = -theta;
			}
			theta += 90;
			this.tipUnitX = unitX;
			this.tipUnitY = unitY;
			this.isInvincible = true;
			this.stunned = true;
			this.lockTip = true;
			this.resetX = this.sprite.x;
			this.resetY = this.sprite.y;
			this.sprite.body.velocity.x += (200 * unitX);
			this.sprite.body.velocity.y += (200 * unitY);
			this.game.camera.follow(null);
			break;

		// Heavy Attack
		case 2:
			this.isInvincible = true;
			attackRangeTheta = 160;
			thetaPerMillis = attackRangeTheta / this.attackAnimationCooldown;
			thetaPerSec = thetaPerMillis * 1000;
			this.weapon.angle -= (this.attackAnimationCooldown * (thetaPerMillis)) / 2;
			this.weapon.body.angularVelocity = thetaPerSec;
			break;

		// Ranged Attack
		case 3:
			if (!this.reloading) {
				magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
				target = Gameplay.getTarget();
				unitX = (target.x - this.sprite.x) / magnitude;
				unitY = (target.y - this.sprite.y) / magnitude;
				theta = Math.acos(unitX);
				theta = theta * 180 / Math.PI;
				if (Math.asin(unitY) < 0) {
					theta = -theta;
				}
				temp = new Projectile(this.game, this.sprite.x + this.weapon.x, this.sprite.y + this.weapon.y, this.projectileVelocity * unitX, this.projectileVelocity * unitY, theta, this.getDamage(), this.projectileType);
				game.world.bringToTop(this.weapon);
				this.projectiles.push(temp);
				this.ammoReserve -= 1;
				if (this.ammoReserve <= 0) {
					this.reloading = true;
					this.game.time.events.add(this.reloadTime, this.reload, this);
				}
			}
			break; 
		}

	this.canAttack = false;
	this.game.time.events.add(this.attackAnimationCooldown, this.stopAttack, this);
}

Player.prototype.hit = function(mob) {
	switch(this.weaponType) {
		case 1:
			if (this.tip.x > mob.sprite.x - mob.sprite.width / 2 && this.tip.x < mob.sprite.x + mob.sprite.width / 2 && this.tip.y > mob.sprite.y - mob.sprite.height / 2 && this.tip.y < mob.sprite.y + mob.sprite.height/2) {
				mob.damage(this.getDamage(), this.attackCooldown, false, false);
			}
			break;

		case 2:
		case 0:
			knockback = true;
			if (this.weaponType == 0) {
				knockback = false;
			}
			weaponLine = new Phaser.Line(this.tip.x, this.tip.y, this.base.x, this.base.y);
			topLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2);
			rightLine = new Phaser.Line(mob.sprite.x + mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2);
			bottomLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2);
			leftLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2, mob.sprite.x - mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2);

			if (weaponLine.intersects(topLine) || weaponLine.intersects(rightLine) || weaponLine.intersects(bottomLine) || weaponLine.intersects(leftLine)) {
				mob.damage(this.getDamage(), this.attackCooldown, true, knockback);
			}
			break;
	}
}

Player.prototype.getDamage = function() {
	return this.dmg * this.damageModifier;
}

Player.prototype.stopAttack = function() {
	if (this.isAttacking) {
		this.isAttacking = false;	
		this.game.time.events.add(this.attackCooldown, this.letAttack, this);
		this.game.time.events.add(150, this.stopInvincible, this);	
		
		if (this.weaponType == 0) {
			this.weapon.body.angularVelocity = 0;
		}
		else if (this.weaponType == 1) {
			this.stop();
			this.lockTip = false;
			this.sprite.x = this.resetX;
			this.sprite.y = this.resetY;
			this.game.camera.follow(this.sprite);
			this.game.time.events.add(150, this.stopStunned, this);
		}
		else if (this.weaponType == 2) {
			this.weapon.body.angularVelocity = 0;
		}
	}
}

Player.prototype.letAttack = function() {
	this.canAttack = true;
}

Player.prototype.damage = function(dmg) {
	if (!this.isInvincible) {
		this.health -= dmg;
		this.game.time.events.add((this.invincibleLength * this.invincibleModifier) - 200, this.flash, this);
		this.game.time.events.add(this.invincibleLength * this.invincibleModifier, this.stopInvincible, this);	
		this.sprite.alpha = .5;
		this.isInvincible = true;
	}
}

Player.prototype.reload = function() {
	this.reloading = false;
	this.ammoReserve = this.ammoCapacity;
}

Player.prototype.flash = function() {
	this.sprite.alpha = 1;
}

Player.prototype.stopInvincible = function() {
	this.isInvincible = false;
}

Player.prototype.stopStunned = function() {
	this.stunned = false;
}

Player.prototype.isAlive = function() {
	if (this.health > 0) {
		return true;
	}
	return false;
}

Player.prototype.changeWeaponType = function(weaponAsset) {
	switch(weaponAsset) {
		case 'sword':
		case 'crowbar':
			this.attackAnimationCooldown = 100;
			this.attackCooldown = 550;
			this.weaponType = 0;
			this.dmg = 30;
			break;

		case 'lightSword':
		case 'lance':
			this.attackAnimationCooldown = 200;
			this.attackCooldown = 350;
			this.dmg = 25;
			this.weaponType = 1;
			break;

		case 'heavySword':
		case 'pipe':
			this.attackAnimationCooldown = 500;
			this.attackCooldown = 850;
			this.dmg = 35;
			this.weaponType = 2;
			break;

		case 'm16':
			this.attackAnimationCooldown = 0;
			this.attackCooldown = 50;
			this.dmg = 7;
			this.projectileType = 'bullet';
			this.ammoCapacity = 30;
			this.ammoReserve = 30;
			this.reloadTime = 1800;
			this.weaponType = 3;
			this.projectileVelocity = 500;
			break;
		
		case 'deagle':	
			this.attackAnimationCooldown = 0;
			this.attackCooldown = 500;
			this.dmg = 25;
			this.projectileType = 'bullet';
			this.ammoCapacity = 7;
			this.ammoReserve = 7;
			this.reloadTime = 1350;
			this.weaponType = 3;
			this.projectileVelodity = 350;
			break;

		case 'crossbow':
			this.attackAnimationCooldown = 0;
			this.attackCooldown = 0;
			this.dmg = 50;
			this.projectileType = 'arrow';
			this.ammoCapacity = 1;
			this.ammoReserve = 1;
			this.reloadTime = 1450;
			this.weaponType = 3;
			this.projectileVelocity = 270;
			break;
	}
}

Player.prototype.setAttackCooldown = function(cooldown) {
	this.attackCooldown = cooldown;
}

Player.prototype.setAttackDamage = function(damage) {
	this.attack = damage;
}

Player.prototype.switchWeapon = function(newWeaponAsset) {
	if (this.isAttacking) {
		this.stopAttack();
	}	
	this.weapon.scale.setTo(1.5, 1.5);
	this.projectileType = '';
	if (newWeaponAsset == 'deagle') {
		this.weapon.scale.setTo(.35, .35);
	}
	else if (newWeaponAsset == 'm16' || newWeaponAsset == 'crossbow') {
		this.weapon.scale.setTo(.75, .75);
	}
	this.reloading = false;
	this.weapon.loadTexture(newWeaponAsset);
	this.changeWeaponType(newWeaponAsset);
}

Player.prototype.pointWeapon = function() {
	this.weapon.angle = this.targetAngle();
}

Player.prototype.findTip = function(theta) {
	unitX = Math.cos((this.weapon.angle - 90) * Math.PI / 180);
	unitY = Math.sin((this.weapon.angle - 90) * Math.PI / 180);
	this.tip.x = ((this.sprite.width / 5) + this.weapon.height * 2) * unitX;
	this.tip.y = ((this.sprite.width / 5) + this.weapon.height * 2) * unitY;
	this.base.x = ((this.sprite.width / 5) + this.weapon.height / 8) * unitX;
	this.base.y = ((this.sprite.width / 5) + this.weapon.height / 8) * unitY;
	this.tip.x += this.sprite.x;
	this.tip.y += this.sprite.y;
	this.base.x += this.sprite.x;
	this.base.y += this.sprite.y;
}

Player.prototype.targetAngle = function() {
	magnitude = Math.sqrt(Math.pow(target.x - playerSprite.x, 2) + Math.pow(target.y - playerSprite.y, 2));
	unitX = (target.x - playerSprite.x) / magnitude;	
	unitY = (target.y - playerSprite.y) / magnitude;
	theta = Math.acos(unitX);
	theta = theta * 180 / Math.PI;
	if (Math.asin(unitY) < 0) {
		theta = -theta;
	}
	return theta + 90;
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
