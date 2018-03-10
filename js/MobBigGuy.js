MobBigGuy = function(game) {
    Mob.call(this, game, 'monster2', 180);
}

MobBigGuy.prototype = Object.create(Mob.prototype);
MobBigGuy.prototype.constructor = MobBigGuy;
