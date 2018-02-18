Player = function(game) {

    this.game = game;

    this.health = 10;
    this.isAttacking = false;

    this.sprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.sprite);

    // melee
    this.swing = this.game.add.group();
    this.swing.enableBody = true;
    this.swing.physicsBodyType = Phaser.Physics.ARCADE;
}

Player.prototype.update = function() {

}

Player.prototype.attack = function() {
    if (this.isAttacking)
        return;

    this.isAttacking = true;

    slashfx = this.game.add.sprite(this.sprite.x + 30, this.sprite.y, 'slashfx');
    slashfx.anchor.setTo(0.5, 0.5);
    slashfx.scale.setTo(2, 2);

    slashBox = this.swing.create(this.sprite.x + 30, this.sprite.y);
    slashBox.anchor.setTo(0.5, 0.5);
    slashBox.scale.setTo(2, 2);
    slashBox.enableBody = true;

    this.game.time.events.add(100, this.stopAttack, this);
}

Player.prototype.stopAttack = function() {
    this.isAttacking = false;
    this.swing.remove(slashBox);
    slashfx.kill();
    slashBox.kill();
}
