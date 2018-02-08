Mob = function(game) {

    this.game = game;

    this.health = 10;

    //this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

	this.sprite = game.add.sprite(0, 0, 'player');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this.sprite);
	this.sprite.body.immovable = true;
	this.sprite.body.stopVelocityOnCollide = true;
}

Mob.prototype.update = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.followPlayer();
}

Mob.prototype.followPlayer = function() {
	playerSprite = Gameplay.getPlayer();
	let dist = game.physics.arcade.distanceBetween(this.sprite, playerSprite);
	game.physics.arcade.moveToObject(this.sprite, playerSprite, 50);
	game.physics.arcade.collide(this.sprite, playerSprite, this.collide, null, this);
}

Mob.prototype.collide = function() {
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
}
