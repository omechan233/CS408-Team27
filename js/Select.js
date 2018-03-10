var Select = {};
var text;

Select.preload = function() {
	game.load.image('forest', 'assets/maps/preview_anicent_forest.png');
	game.load.image('desert', 'assets/maps/preview_great_desert.png');
	game.load.image('cave', 'assets/maps/preview_underground_cave.png');
	game.load.image('forestBkg', 'assets/maps/preview_background_ancient_forest.jpg');
	game.load.image('desertBkg', 'assets/maps/preview_background_great_desert.jpg');
	game.load.image('baseBkg', 'assets/maps/preview_background_secret_base.jpg');
	game.load.image('caveBkg', 'assets/maps/preview_background_underground_cave.jpg');
	game.load.image('startInactive', 'assets/menu/start.png');
	game.load.image('menuInactive', 'assets/menu/exit.png');
	game.load.image('menuActive', 'assets/menu/exit_select.png');
	game.add.plugin(PhaserInput.Plugin);
}

Select.create = function() {
	background = game.add.sprite(0, 0, 'forestBkg', this);
	background.width = game.camera.width;
	background.height = game.camera.height; 
  var maps = [];
    var el;
    game.stage.backgroundColor = '#cc1634';
    this.startBtn = game.add.button(game.world.centerX - 90, game.world.centerY + 225, 'startInactive', this.startGame, this);
    
    this.startBtn.onInputOver.add(this.startOver, this);
    this.startBtn.onInputOut.add(this.startOut, this);
    
    menuBtn = game.add.button(10, 10, 'menuInactive', this.goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(this.menuOver, this);
	menuBtn.onInputOut.add(this.menuOut, this);
    
    maps.push(game.add.sprite(0, 0, 'forest')); 
    maps.push(game.add.sprite(0, 0, 'forest')); 
    maps.push(game.add.sprite(0, 0, 'desert'));
    maps.push(game.add.sprite(0, 0, 'cave')); 
    for (var i = 0; i < maps.length; i++) {
        maps[i].anchor.setTo(0.5, 0.5);
        maps[i].x = game.width + 150;
        maps[i].y = game.height / 2;
        maps[i].inputEnabled = true;
        maps[i].events.onInputDown.add(clickListener, this);
    }
	game.world.bringToTop(maps[0]);
    
    var totalMaps = maps.length;
    var prime = 0;
    var animationSpeed = 200;

    function setToPosition(prime) {
        maps[prime].x = game.width / 2;
        if (prime<(totalMaps-1)) {
            maps[prime + 1].x = game.width * .75;
            maps[prime + 1].scale.setTo(0.5,0.5);
		for (var i = prime + 2; i < totalMaps; i++) {
			maps[i].x = game.world.width + (game.width/2) * i;
		}
        }
    
        if (prime > 0) {
            maps[prime - 1].x = game.width / 2;
            maps[prime - 1].scale.setTo(0.5,0.5);
        }
    }
    
    setToPosition(prime);
    var xleft = game.width / 4;
    var xprime = game.width / 2;
    var xright = game.width * .75;

    function nextMap() {
        game.add.tween(maps[prime]).to( { x: xleft}, animationSpeed, null, true);
    
        game.add.tween(maps[prime].scale).to( { x: 0.5 , y: 0.5}, animationSpeed, null, true);
        
        if (prime < 3) {
            game.add.tween(maps[prime+1]).to( { x: xprime}, animationSpeed, null, true);
            game.add.tween(maps[prime+1].scale).to( { x: 1 , y: 1}, animationSpeed, null, true);
        }
        
        if (prime < 2) {
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
		//drive.google.com/open?id=1dnIYw2BC718_7rzWmlvxA3f8_Ekm3Mqlor (var i = prime, i < totalMaps; i++) {
        }
    
        if (prime < (totalMaps - 1)) {
            //themes[prime+1].x = -150;
            maps[prime+1].scale.setTo(0.5,0.5);
            game.add.tween(maps[prime+1]).to( { x: game.width +    150}, animationSpeed, null, true);
        }
	prime--;
    }
    
    text = game.add.text(game.world.centerX, game.world.centerY + 175, 'Forest', {
            font: "65px Arial",
            fill: "#22ff55",
            align: "center",
	   	stroke: "#000000"
    });
	text.strokeThickness = 5;
    
    text.anchor.setTo(0.5, 0.5);
    
    function actionOnClick(ind) {
        var name;
        switch (ind) {
            case 0:
                name = "Forest";
		background.loadTexture('forestBkg');
		text.fill = "#228b22";
                text.stroke = "#ffffff";
		break;
		
		case 1:
                	name = "Forest - 2";
			background.loadTexture('forestBkg');
			text.fill = "#228b22";
                	text.stroke = "#ffffff";
                break;
		
		case 2:
                	name = "Desert";
			background.loadTexture('desertBkg');
			text.fill = "#fffacd";
                	text.stroke = "#000000";
                	break;
           
		case 3:
                	name = "Cave";
			background.loadTexture('caveBkg');
			text.fill = "#111111";
                	text.stroke = "#ffffff";
                	break;
        }
        text.setText(name);
    }
    
    function clickListener (el) {
        var clickedPos = maps.indexOf(el);
        if (clickedPos > prime) {
            //move to left
            nextMap();
            actionOnClick(clickedPos);
        } else if (clickedPos < prime) {
            previousMap();
            actionOnClick(clickedPos);
        }
	game.world.bringToTop(maps[prime]);
    }
}

Select.startGame = function() {
    game.state.clearCurrentState();
    game.state.start('Gameplay');
}

Select.startOver = function(){
    this.startBtn.loadTexture('startActive');
}

Select.startOut = function(){
    this.startBtn.loadTexture('startInactive');
}

Select.goToMenu = function(){
    game.state.clearCurrentState();
	game.state.start('Menu');
}

Select.menuOver = function(){
	menuBtn.loadTexture('menuActive');
}

Select.menuOut = function(){
	menuBtn.loadTexture('menuInactive');
}
