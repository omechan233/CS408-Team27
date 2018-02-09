var SignUp = {};
var newEmailInput;
var newUserInput;
var newPassInput;

SignUp.preload = function() {
    game.load.spritesheet('startInactive', 'assets/start.png');
    game.load.spritesheet('startActive', 'assets/start_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

SignUp.create = function() {
    
    startButton = game.add.button(game.world.centerX - 75, game.world.centerY + 225, 'startInactive', start, this);
    startButton.onInputOver.add(startOver, this);
    startButton.onInputOut.add(startOut, this);
    
    game.stage.backgroundColor = '#292c30';
//    var newEmailInput = game.add.inputField(game.world.centerX - 75, game.world.centerY, {
//        font: '18px Skia',
//        fill: '#212121',
//        fontWeight: 'bold',
//        width: 150,
//        padding: 8,
//        borderWidth: 1,
//        borderColor: '#000',
//        borderRadius: 6,
//        placeHolder: 'Email',
//        type: PhaserInput.InputType.text
//    });
    
    var newUserInput = game.add.inputField(game.world.centerX - 75, game.world.centerY + 70, {
        font: '18px Skia',
        fill: '#212121',
        fontWeight: 'bold',
        width: 150,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: 'Username',
        type: PhaserInput.InputType.text
    });
    
    var newPassInput = game.add.inputField(game.world.centerX - 75, game.world.centerY + 140, {
        font: '18px Skia',
        fill: '#212121',
        fontWeight: 'bold',
        width: 150,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        placeHolder: 'Password',
        type: PhaserInput.InputType.password
    });
}

function saveUserData(user) {
    var fs = require('fs');
    var json = JSON.stringify(user);
    fs.writeFile("user.txt", jsonUser, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}


function start() {
    var newUser = newUserInput.value;
    var newPassword = newPassInput.value;
    var user = {
        username: newUser,
        password: newPassword,
        highscore: 0
    }
    saveUserData(json);
    
	game.state.start('Menu');
}

function startOver() {
    startButton.loadTexture('startActive');
}

function startOut() {
    startButton.loadTexture('startInactive');
}