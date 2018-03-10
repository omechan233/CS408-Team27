MobBadGuy = function(game) {
	Mob.call(this, game, 'player');
}

MobBadGuy.prototype = Object.create(Mob.prototype);
MobBadGuy.prototype.constructor = MobBadGuy;
