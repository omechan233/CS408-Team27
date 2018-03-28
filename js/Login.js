var Login = {};
var loginUserInput;
var loginPassInput;

Login.preload = function() {
    game.load.spritesheet('login',  'assets/menu/login.png');
    game.load.spritesheet('signup', 'assets/menu/signup.png');
    game.load.spritesheet('title', 'assets/title_text.png');
    game.load.spritesheet('loginActive',    'assets/menu/login_select.png');
    game.load.spritesheet('signupActive',   'assets/menu/signup_select.png');
    game.add.plugin(PhaserInput.Plugin);
}

Login.create = function() {
    socket = io.connect();
    // Create Background
    game.stage.backgroundColor = '#292c30';
    
    titleSprite = game.add.sprite(game.world.centerX, game.world.centerY - 100, 'title');
    
    titleSprite.anchor.setTo(0.5 , 0.5);
    
    // Build buttons on top of sprites
    loginButton = game.add.button(game.world.centerX - 75, game.world.centerY + 150, 'login', logIn, this);
    
    loginButton.onInputOut.add(loginOut, this);
    
    var message = game.add.text(game.world.centerX - 50, game.world.centerY + 200, 'New User? Sign Up.', {
        font: 'Skia',
        fill: '#6fb9c6',
        fontSize: 12
    });
    signupButton = game.add.button(game.world.centerX - 75, game.world.centerY + 225, 'signup', signUp, this);
    
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
        type: PhaserInput.InputType.text
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