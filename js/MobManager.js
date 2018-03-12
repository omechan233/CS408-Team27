MobManager = function(game) {
    // mobType takes in a number
}

MobManager.prototype.spawnMob = function(mobType) {
    return new Mob(game, 'monster' + mobType, 100);
}

MobManager.prototype.spawnRandomMob = function() {
    return new Mob(game, 'monster' + rnd.integerInRange(1, 10), rnd.integerInRange(50, 150));
}
