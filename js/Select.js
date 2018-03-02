var Select = {};
var maps = [];

Select.preload = function() {
    game.load.image('ocean', 'assets/ocean_preview.png');
    game.load.image('forest', 'assets/forest_preview.png');
    game.load.image('forest2', 'assets/forest2_preview.png');
    game.load.image('forest3', 'assets/forest3_preview.png');
    game.load.image('water', 'assets/water.png');
    game.load.image('base', 'assets/base_preview.png');
    game.load.image('startInactive', 'assets/start.png');
    game.load.image('menuInactive', 'assets/login.png');
	game.load.image('menuActive', 'assets/login_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

Select.create = function() {
    game.stage.backgroundColor = '#cc1634';
    this.startBtn = game.add.button(game.world.centerX - 100, game.world.centerY + 225, 'startInactive', this.startGame, this);
//    start.onInputOver.add(startOver, this);
//    start.onInputOut.add(startOut, this);
    
    menuBtn = game.add.button(10, 10, 'menuInactive', this.goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(this.menuOver, this);
	menuBtn.onInputOut.add(this.menuOut, this);
    
    maps.push(game.add.sprite(0, 0, 'ocean')); 
    maps.push(game.add.sprite(0, 0, 'forest'));
    maps.push(game.add.sprite(0, 0, 'forest2')); 
    maps.push(game.add.sprite(0, 0, 'forest3')); 
    maps.push(game.add.sprite(0, 0, 'water')); 
    maps.push(game.add.sprite(0, 0, 'base')); 
    for (var i = 0; i < maps.length; i++) {
        maps[i].anchor.setTo(0.5, 0.5);
        maps[i].x = game.width + 150;
        maps[i].y = game.height / 2;
//        maps[i].inputEnabled = true;
        maps[i].events.onInputDown.add(clickListener, this);
    }
    
    var totalMaps = maps.length;
    var prime = 0;
    var animationSpeed = 200;

    function setToPosition(prime) {
        maps[prime].x = game.width;
        if (prime<(totalMaps-1)) {
            maps[prime + 1].x = game.width / 2;
            maps[prime + 1].scale.setTo(0.5,0.5);
        }
    
        if (prime > 0) {
            maps[prime - 1].x = game.width / 2;
            maps[prime - 1].scale.setTo(0.5,0.5);
        }
    }
    
    setToPosition(prime);
    var xleft = game.width / 2 - 67 - 75;
    var xprime = game.width / 2;
    var xright = game.width / 2 + 67 + 75;

    function nextMap() {
        game.add.tween(maps[prime]).to( { x: xleft}, animationSpeed, null, true);
    
        game.add.tween(maps[prime].scale).to( { x: 0.5 , y: 0.5}, animationSpeed, null, true);
        
        if (prime < 5) {
            game.add.tween(maps[prime+1]).to( { x: xprime}, animationSpeed, null, true);
            game.add.tween(maps[prime+1].scale).to( { x: 1 , y: 1}, animationSpeed, null, true);
        }
        
        if (prime < 4) {
            maps[prime+2].x = game.width + 150;
            maps[prime+2].scale.setTo(0.5,0.5);
            game.add.tween(maps[prime+2]).to( { x: xright}, animationSpeed, null, true);
        }
    
        if (prime > 0) {
        //themes[prime+1].x = -150;
            maps[prime-1].scale.setTo(0.5,0.5);
            game.add.tween(maps[prime-1]).to( { x: -150}, animationSpeed, null, true);
        }
        prime++;
    }

    function previousMap() {
        game.add.tween(maps[prime]).to( { x: xright},       animationSpeed, null, true);
    
        game.add.tween(maps[prime].scale).to( { x: 0.5 , y: 0.5}, animationSpeed, null, true);
    
        if (prime > 0 ) {
            game.add.tween(maps[prime-1]).to( { x: xprime}, animationSpeed, null, true);
            game.add.tween(maps[prime-1].scale).to( { x: 1 , y: 1}, animationSpeed, null, true);
        }
    
        if (prime > 1) {
            maps[prime-2].x = - 150;
            maps[prime-2].scale.setTo(0.5,0.5);
            game.add.tween(maps[prime-2]).to( { x: xleft}, animationSpeed, null, true);
        }
    
        if (prime < (totalMaps - 1)) {
            //themes[prime+1].x = -150;
            maps[prime+1].scale.setTo(0.5,0.5);
            game.add.tween(maps[prime+1]).to( { x: game.width +    150}, animationSpeed, null, true);
        }
        prime--;
    }

    function clickListener (el) {
        console.log(maps.indexOf(el));
        var clickedPos = maps.indexOf(el);
        if (clickedPos > prime) {
            //move to left
            nextMap();
        } else if (clickedPos < prime) {
            previousMap();
        }
    }
}

Select.startGame = function() {
    game.state.start('Gameplay');
}

Select.startOver = function(){
    
}

Select.startOut = function(){

}

Select.goToMenu = function(){
	game.state.start('Menu');
}

Select.menuOver = function(){
	menuBtn.loadTexture('menuActive');
}

Select.menuOut = function(){
	menuBtn.loadTexture('menuInactive');
}