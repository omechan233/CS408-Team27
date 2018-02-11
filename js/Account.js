var Account = {};
var change;
var newPassword;

Account.preload = function() {
    game.load.spritesheet('cpInactive', 'assets/login.png');
    game.load.spritesheet('cpActive', 'assets/login_select.png');
    game.load.spritesheet('changeInactive', 'assets/start.png');
    game.load.spritesheet('changeActive', 'assets/start_select.png');
    game.load.image('menu', 'assets/login.png');
	game.load.image('menuActive', 'assets/login_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

Account.create = function() {
    changePassword = game.add.button(game.world.centerX - 75, game.world.centerY + 225, 'cpInactive', changePassword, this);
    changePassword.onInputOver.add(cpOver, this);
    changePassword.onInputOut.add(cpOut, this);
    
    menuBtn = game.add.button(10, 10, 'menu', goToMenu, this);
	menuBtn.scale.setTo(1.2, 1.2);
	menuBtn.onInputOver.add(menuOver, this);
	menuBtn.onInputOut.add(menuOut, this);
}

function changePassword() {
    change = game.add.button(game.world.centerX - 75, game.world.centerY + 175, 'changeInactive', submit, this);
    
    change.onInputOver.add(changeOver, this);
    change.onInputOut.add(changeOut, this);
    
    newPassword = game.add.inputField(game.world.centerX - 75, game.world.centerY + 70, {
        font: '18px Skia',
        fill: '#212121',
        fontWeight: 'bold',
        width: 150,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: 'New Password',
        type: PhaserInput.InputType.text
    });
}

function submit() {
    console.log(newPassword.value);
}

function changeOver() {
    change.loadTexture('changeActive');
}

function changeOut() {
    change.loadTexture('changeInactive');
}

function cpOver() {
    changePassword.loadTexture('cpActive');
}

function cpOut() {
    changePassword.loadTexture('cpInactive');
}

function goToMenu() {
	game.state.start('Menu');
}

function menuOver() {
	menuBtn.loadTexture('menuActive');
}

function menuOut() {
	menuBtn.loadTexture('menu');
}