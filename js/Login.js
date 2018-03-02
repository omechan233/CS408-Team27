var Login = {};
var loginUserInput;
var loginPassInput;

Login.preload = function() {
    game.load.spritesheet('login', 'assets/login.png');
    game.load.spritesheet('signup', 'assets/signup.png');
    game.load.spritesheet('loginActive', 'assets/login_select.png');
    game.load.spritesheet('signupActive', 'assets/signup_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

Login.create = function() {
    socket = io.connect();
    // Create Background
    game.stage.backgroundColor = '#292c30';
    
    // Add in sprites from spritesheet
//    game.add.sprite(game.world.centerX - 350, game.world.centerY + 50, 'login');

//    game.add.sprite(game.world.centerX + 200, game.world.centerY + 50, 'signup');
    
    // Build buttons on top of sprites
    loginButton = game.add.button(game.world.centerX - 75, game.world.centerY + 150, 'login', logIn, this);
    loginButton.onInputOver.add(loginOver, this);
    loginButton.onInputOut.add(loginOut, this);
    
    var message = game.add.text(game.world.centerX - 50, game.world.centerY + 200, 'New User? Sign Up.', {
        font: 'Skia',
        fill: '#6fb9c6',
        fontSize: 12
    });
    signupButton = game.add.button(game.world.centerX - 75, game.world.centerY + 225, 'signup', signUp, this);
    signupButton.onInputOver.add(signupOver, this);
    signupButton.onInputOut.add(signupOut, this);
    
    loginUserInput = game.add.inputField(game.world.centerX - 75, game.world.centerY, {
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
    loginPassInput = game.add.inputField(game.world.centerX - 75, game.world.centerY + 70, {
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

function logIn() {
    var username = loginUserInput.value;
    var password = loginPassInput.value;
    var user = {
        username: username,
        password: password,
    }
    // send user data to server for verification
    socket.emit('onLogin', user);

    socket.on('loginTrue', () => {
        game.state.start('Menu');
    });
    socket.on('loginFalse', () => {
        console.log("invalid login");
    });
}

function signUp() {
    game.state.clearCurrentState();
    game.state.start('SignUp');
}

function loginOut() {
    loginButton.loadTexture('login');
}

function loginOver() {
    loginButton.loadTexture('loginActive');
}

function signupOut() {
    signupButton.loadTexture('signup');
}

function signupOver() {
    signupButton.loadTexture('signupActive');
}