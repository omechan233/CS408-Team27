MobManager = function(game) {
    this.mobSpawnTime = 1000;
    this.maxMobs = 1;
    this.game = game;
    this.difficulty = game.getDifficulty();
    if (this.difficulty == "easy") {
        this.mobSpawnTime *= 5;
        this.maxMobs = 10;
    }
    else if (this.difficulty == "medium") {
        this.mobSpawnTime *= 4;
        this.maxMobs = 15;
    }
    else if (this.difficulty == "hard") {
        this.mobSpawnTime *= 3;
        this.maxMobs = 20;
    }

    game.time.events.loop(this.mobSpawnTime, this.spawnRandomMobTimer, this);
}

MobManager.prototype.spawnMob = function(mobType) {
    this.game.getMobs().push(new Mob(game, 'monster' + mobType, 100));
}

MobManager.prototype.spawnRandomMob = function() {
    this.game.getMobs().push(new Mob(game, 'monster' + rnd.integerInRange(1, 10), rnd.integerInRange(50, 200)));
}

MobManager.prototype.spawnRandomMobTimer = function() {
    if (this.game.getMobs().length >= this.maxMobs || this.game.isPaused())
        return;

    this.spawnRandomMob();
}