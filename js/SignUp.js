var SignUp = {};
var newEmailInput;
var newUserInput;
var newPassInput;

SignUp.preload = function() {
    game.load.spritesheet('startInactive',  'assets/menu/start.png');
    game.load.spritesheet('startActive',    'assets/menu/start_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

SignUp.create = function() {
    socket = io.connect();
    
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
    
    newUserInput = game.add.inputField(game.world.centerX - 75, game.world.centerY + 70, {
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
    
    newPassInput = game.add.inputField(game.world.centerX - 75, game.world.centerY + 140, {
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
    socket.emit('saveData', user);
}

function start() {
    var newUser = newUserInput.value;
    var newPassword = newPassInput.value;
    // no empty fields for signup
    if (!newUser || !newPassword)
        return;

    var user = {
        username: newUser,
        password: newPassword,
        // top 5 highscores
        highscores: [0, 0, 0, 0, 0]
    }

    socket.emit('checkSignup', user);

    socket.on('signupTrue', () => {
        saveUserData(user);
        game.state.clearCurrentState();
        game.state.start('Menu');
    });
    socket.on('signupFalse', () => {
        console.log("username taken");
    });
}

function startOver() {
    startButton.loadTexture('startActive');
}

function startOut() {
    startButton.loadTexture('startInactive');
}



