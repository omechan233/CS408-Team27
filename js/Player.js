/*
 *
 *  TODO:
 *  Fix directional combat to use mouse positions relative to player, rather than window
 *
 */

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

Player.prototype.stopAttack = function() {
    this.isAttacking = false;
    this.swing.remove(slashBox);
    slashfx.kill();
    slashBox.kill();
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



