Player = function(game) {

    this.game = game;

    this.health = 10;
    this.isAttacking = false;

    this.sprite = game.add.sprite(game.camera.x + game.camera.width / 2, game.camera.y + game.camera.height / 2, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.sprite);
}

Player.prototype.update = function() {

}

Player.prototype.attack = function() {
    if (this.isAttacking)
        return;

    this.isAttacking = true;
    this.slashfx = game.add.sprite(this.sprite.x + 30, this.sprite.y, 'slashfx');
    this.slashfx.anchor.setTo(0.5, 0.5);
    this.slashfx.scale.setTo(2, 2);
    this.game.time.events.add(125, this.stopAttack, this);
}

Player.prototype.stopAttack = function() {
    this.isAttacking = false;
    this.slashfx.kill();
}
