MobGhost = function(game) {
    Mob.call(this, game, 'monster1');
}

MobGhost.prototype = Object.create(Mob.prototype);
MobGhost.prototype.constructor = MobGhost;
