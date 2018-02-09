MobBadGuy = function(game) {

    var x = game.rnd.integerInRange(0, 200);
    var y = game.rnd.integerInRange(0, 200);

    this.sprite = game.add.sprite(x, y, 'player');

    Mob.call(this, game);

}

MobBadGuy.prototype = Object.create(Mob.prototype);
MobBadGuy.prototype.constructor = MobBadGuy;