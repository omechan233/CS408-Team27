/*
 *
 *  TODO:
 *  Fix directional combat to use mouse positions relative to player, rather than window
 *
 */

Player = function(game, spawnPoint, weaponAsset) {

	this.game = game;

	// Player Stats	
	this.health = 100;
	this.xp = 0;
	this.level = 0;
	this.speed = 275;
	this.dmg = 10;

	// Player Status
	this.isAttacking = false;
	this.canAttack = true;
	this.isSpecial = false;
	this.canSpecial = true;
	this.isInvincible = false;
	this.reloading = false;
	this.stunned = false;
	this.specialInvincible = false;
	this.oldWeaponVelocity = 0;
	this.flipped = 1;

	// Player Limits
	this.attackCooldown = 100; 
	this.attackAnimationTime = 250;
	this.specialCooldown = 10 * 1000;
	this.invincibleLength = 900;
	this.ammoCapacity = 30;
	this.ammoReserve = 30;
	this.reloadTime = 500;
	
	// Other
	this.lockTip = false;
	this.reset = true;
	this.tipUnitX = 0;
	this.tipUnitY = 0
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
	this.specialAttackModifier = 1.0;
	this.specialLengthModifier = 1.0;
	this.specialReloadModifier = 1.0;

	// Player Sprite
	this.sprite = game.add.sprite(
		spawnPoint.x,
		spawnPoint.y,
		'player'
	);
	this.sprite.anchor.setTo(0.5, 0.5);
	this.playerScale = 1.6;
	this.sprite.scale.setTo(this.playerScale, this.playerScale);

	// Player Animations
	this.animSpeed = 10;
	this.sprite.animations.add('stand', 	[0], 10, true, true);
	this.sprite.animations.add('walkdown', 	[0, 1, 2, 3], 10, true, true);
	this.sprite.animations.add('walkleft', 	[4, 5, 6, 7], 10, true, true);
	this.sprite.animations.add('walkright', [8, 9, 10, 11], 10, true, true);
	this.sprite.animations.add('walkup', 	[12, 13, 14, 15], 10, true, true);

	// Player Sprite Physics
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.sprite.body.setSize(
		this.sprite.width / this.playerScale / 2,
		this.sprite.height / this.playerScale / 2 - this.sprite.height / this.playerScale / 8,
		this.sprite.width / this.playerScale / 2 - this.sprite.width / this.playerScale / 4,
		this.sprite.height / this.playerScale / 2 + this.sprite.height / this.playerScale / 8
	);

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
	this.flipped = this.weapon.angle <= 0 ? -1 : 1;

	if (this.weapon.key == "deagle")
		this.weapon.scale.setTo(.35 * this.flipped, .35);
	if (this.weapon.key == "m16")
		this.weapon.scale.setTo(.75 * this.flipped, .75);

	if (player.xp >= 100) {
		player.level++;
		player.xp %= 100;
		player.health = 100;
	}

	if (!this.isAttacking) {
		this.pointWeapon();
	}
	if (!this.stunned) {
		// play animations
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

		this.stop();

		if (this.game.input.activePointer.rightButton.isDown && !this.isAttacking && this.canSpecial) {
			this.specialAttack();
		}
		else if (this.game.input.activePointer.leftButton.isDown && !this.isAttacking) {
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
	if (!this.sprite.body)
		return;

	if (!this.sprite.body.velocity.x && !this.sprite.body.velocity.y)
		this.sprite.animations.stop(null, true);
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
}

Player.prototype.attack = function() {
	if (this.isAttacking || !this.canAttack || this.game.isPaused())
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
			magnitude = Math.sqrt(Math.pow(target.x - player.sprite.x, 2) + Math.pow(target.y - player.sprite.y, 2));
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
			this.reset = true;
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
				magnitude = Math.sqrt(Math.pow(target.x - player.sprite.x, 2) + Math.pow(target.y - player.sprite.y, 2));
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
					this.game.time.events.add(this.reloadTime * this.specialReloadModifier, this.reload, this);
				}
			}
			break; 
		}

	this.canAttack = false;
	this.game.time.events.add(this.attackAnimationCooldown, this.stopAttack, this);
}

Player.prototype.specialAttack = function() {
	if (this.weapon.key == 'crossbow') {
		this.specialReloadModifier = 0.1;
		this.game.time.events.add(2.5 * 1000, this.resetSpecialReload, this);
		this.reload();
	}
	if (this.isAttacking || !this.canAttack)
		return;

	this.isSpecial = true;
	this.isAttacking = true;
	this.canSpecial = false;
	switch(this.weaponType) {
		// Normal attack
		case 0:
			this.isInvincible = true;
			attackRangeTheta = 70;
			thetaPerMillis = attackRangeTheta / this.attackAnimationCooldown;
			thetaPerSec = thetaPerMillis * 1000;
			this.weapon.angle -= (this.attackAnimationCooldown * (thetaPerMillis)) / 2;
			this.weapon.body.angularVelocity = thetaPerSec;
			this.specialAttackModifier = 2.5;
		break;

		// Light Attack
		case 1:
			magnitude = Math.sqrt(Math.pow(target.x - player.sprite.x, 2) + Math.pow(target.y - player.sprite.y, 2));
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
			this.isSpecialInvincible = true;
			this.lockTip = true;
			this.reset = false;
			this.sprite.body.velocity.x += (800 * unitX);
			this.sprite.body.velocity.y += (800 * unitY);
			this.specialLengthModifier = 2.5;
			this.specialAttackModifier = 2.0;
			break;

		// Heavy Attack
		case 2:
			this.specialLengthModifier = 8;
			this.isInvincible = true;
			this.isSpecialInvincible = true;
			attackRangeTheta = 1080 * 2.5;
			thetaPerMillis = attackRangeTheta / (this.attackAnimationCooldown * this.specialLengthModifier);
			thetaPerSec = thetaPerMillis * 1000;
			this.weapon.angle -= ((this.attackAnimationCooldown * this.specialLengthModifier) * (thetaPerMillis)) / 2;
			this.weapon.body.angularVelocity = thetaPerSec;
			break;

		// Ranged Attack
		case 3:
			if (!this.reloading) {
				magnitude = Math.sqrt(Math.pow(target.x - player.sprite.x, 2) + Math.pow(target.y - player.sprite.y, 2));
				target = Gameplay.getTarget();
				unitX = (target.x - this.sprite.x) / magnitude;
				unitY = (target.y - this.sprite.y) / magnitude;
				theta = Math.acos(unitX);
				theta = theta * 180 / Math.PI;
				if (Math.asin(unitY) < 0) {
					theta = -theta;
				}
				switch (this.weapon.key) {
					case 'm16':
						tempTheta = theta;
						for (var i = 0; i < 15; i++) {
							theta = tempTheta;
							offset = game.rnd.integerInRange(-15, 15);
							theta += offset;
							theta = theta * Math.PI / 180;
							unitX = Math.cos(theta);
							unitY = Math.sin(theta);
							theta = theta * 180 / Math.PI;
							temp = new Projectile(this.game, this.sprite.x + this.weapon.x, this.sprite.y + this.weapon.y, this.projectileVelocity * unitX, this.projectileVelocity * unitY, theta, this.getDamage(), this.projectileType);
							game.world.bringToTop(this.weapon);
							this.projectiles.push(temp);
						}
						break;

					case 'deagle':
						temp = new Projectile(this.game, this.sprite.x + this.weapon.x, this.sprite.y + this.weapon.y, this.projectileVelocity * unitX, this.projectileVelocity * unitY, theta, this.getDamage() * 3, this.projectileType);
						temp.sprite.scale.setTo(3, 3);
						game.world.bringToTop(this.weapon);
						this.projectiles.push(temp);
						this.ammoReserve -= 3;
						if (this.ammoReserve <= 0) {
							this.reloading = true;
							this.game.time.events.add(this.reloadTime, this.reload, this);
						}
						break;
				}
			}
			break; 
		}

	this.canAttack = false;
	this.game.time.events.add(this.attackAnimationCooldown * this.specialLengthModifier, this.stopAttack, this);
	this.game.time.events.add(this.attackAnimationCooldown * this.specialLengthModifier, this.stopSpecial, this);
	this.game.time.events.add(this.specialCooldown, this.letSpecial, this);
}

Player.prototype.hit = function(mob) {
	switch(this.weaponType) {
		case 1:
			if (this.tip.x > mob.sprite.x - mob.sprite.width / 2 && this.tip.x < mob.sprite.x + mob.sprite.width / 2 && this.tip.y > mob.sprite.y - mob.sprite.height / 2 && this.tip.y < mob.sprite.y + mob.sprite.height/2) {
				if (!this.isSpecial) {
					mob.damage(this.getDamage(), this.attackCooldown, false, false);
				}
				else {
					mob.damage(this.getDamage(), 150, false, false);
				}
			}
			break;

		case 2:
		case 0:
			invinTime = this.attackCooldown;
			knockback = true;
			if (this.weaponType == 0) {
				knockback = false;
			}
			else if (this.weaponType == 2 && this.isSpecial) {
				invinTime = 150;
			}
			weaponLine = new Phaser.Line(this.tip.x, this.tip.y, this.base.x, this.base.y);
			topLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2);
			rightLine = new Phaser.Line(mob.sprite.x + mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2);
			bottomLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2, mob.sprite.x + mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2);
			leftLine = new Phaser.Line(mob.sprite.x - mob.sprite.width / 2, mob.sprite.y + mob.sprite.height / 2, mob.sprite.x - mob.sprite.width / 2, mob.sprite.y - mob.sprite.height / 2);

			if (weaponLine.intersects(topLine) || weaponLine.intersects(rightLine) || weaponLine.intersects(bottomLine) || weaponLine.intersects(leftLine)) {
				mob.damage(this.getDamage(), invinTime, true, knockback);
			}
			break;
	}
}

Player.prototype.getDamage = function() {
	return this.dmg * this.damageModifier * this.specialAttackModifier;
}

Player.prototype.stopAttack = function() {
	if (!this)
		return;
	
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
			if (this.reset) {
				this.sprite.x = this.resetX;
				this.sprite.y = this.resetY;
				this.game.camera.follow(this.sprite);
			}
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

Player.prototype.stopSpecial = function() {
	this.isSpecial = false;
	this.specialAttackModifier = 1.0;
	this.specialLengthModifier = 1.0;
	this.stopSpecialInvincible();
}

Player.prototype.resetSpecialReload = function() {
	this.specialReloadModifier = 1.0;
}

Player.prototype.letSpecial = function() {
	this.canSpecial = true;
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
	if (!this.isSpecialInvincible) {
		this.isInvincible = false;
	}
}

Player.prototype.stopSpecialInvincible = function() {
	this.isSpecialInvincible = false;
	this.stopInvincible();
}

Player.prototype.stopStunned = function() {
	this.stunned = false;
}

Player.prototype.isAlive = function() {
	return this.health > 0;
}

Player.prototype.changeWeaponType = function(weaponAsset) {
	switch(weaponAsset) {
		case 'sword':
		case 'crowbar':
			this.attackAnimationCooldown = 300;
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
			this.projectileVelocity = 550;
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
			this.projectileVelodity = 500;
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
			this.projectileVelocity = 400;
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
	magnitude = Math.sqrt(Math.pow(target.x - player.sprite.x, 2) + Math.pow(target.y - player.sprite.y, 2));
	unitX = (target.x - player.sprite.x) / magnitude;	
	unitY = (target.y - player.sprite.y) / magnitude;
	theta = Math.acos(unitX);
	theta = theta * 180 / Math.PI;
	if (Math.asin(unitY) < 0) {
		theta = -theta;
	}
	return theta + 90;
}

Player.prototype.normalizeSpeed = function() {
	magnitude = Math.sqrt(Math.pow(this.sprite.body.velocity.x, 2) + Math.pow(this.sprite.body.velocity.y, 2));
	unitX = this.sprite.body.velocity.x / magnitude;
	unitY = this.sprite.body.velocity.y / magnitude;
	this.sprite.body.velocity.x = (this.speed * this.speedModifier) * unitX;
	this.sprite.body.velocity.y = (this.speed * this.speedModifier) * unitY;
}

