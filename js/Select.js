var Select = {};
var map;

Select.preload = function() {
    game.load.spritesheet('base', 'assets/base.png');
    game.add.plugin(PhaserInput.Plugin);
}

Select.create = function() {
    game.stage.backgroundColor = '#cc1634';
    map = game.add.button(game.world.centerX - 100, game.world.centerY - 225, 'base', startGame, this);
    map.onInputOver.add(mapOver, this);
    map.onInputOut.add(mapOut, this);
}

function startGame() {
    game.state.start('Gameplay');
}

function mapOver() {
    map.alpha = "0.85";   
}

function mapOut() {
    map.alpha = "1.00";
}