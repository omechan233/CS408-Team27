var Account = {};
var change;
var newPassword;

Account.preload = function() {
    game.load.spritesheet('cpInactive',     'assets/menu/pwd_reset.png');
    game.load.spritesheet('cpActive',       'assets/menu/pwd_reset_select.png');
    game.load.spritesheet('changeInactive', 'assets/menu/submit.png');
    game.load.spritesheet('changeActive',   'assets/menu/submit_select.png');
    game.load.image('menu',                 'assets/menu/exit.png');
	game.load.image('menuActive',           'assets/menu/exit_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

Account.create = function() {
    background = game.add.sprite(0, 0, 'background', this);
    background.width = game.camera.width;
	background.height = game.camera.height;
    
    input = game.add.button(game.world.centerX - 75, game.world.centerY + 225, 'cpInactive', changePassword, this);
    input.onInputOver.add(cpOver, this);
    input.onInputOut.add(cpOut, this);
    
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
    socket.emit('changePass', newPassword.value);
}

function changeOver() {
    change.loadTexture('changeActive');
}

function changeOut() {
    change.loadTexture('changeInactive');
}

function cpOver() {
    input.loadTexture('cpActive');
}

function cpOut() {
    input.loadTexture('cpInactive');
}

function goToMenu() {
    game.state.clearCurrentState();
	game.state.start('Menu');
}

function menuOver() {
	menuBtn.loadTexture('menuActive');
}

function menuOut() {
	menuBtn.loadTexture('menu');
}
