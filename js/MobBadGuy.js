MobBadGuy = function(game) {
	Mob.call(this, game);
}

MobBadGuy.prototype = Object.create(Mob.prototype);
MobBadGuy.prototype.constructor = MobBadGuy;
