var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('file-system');
var handler = require('./server/handler.js');
var passwordHash = require('password-hash');

app.use('/css',     express.static(__dirname + '/css'));
app.use('/js',      express.static(__dirname + '/js'));
app.use('/assets',  express.static(__dirname + '/assets'));
app.use('/server',  express.static(__dirname + '/server'));
app.use('/phaser',  express.static(__dirname + '/node_modules/phaser/build'))
app.use('/node_modules',  express.static(__dirname + '/node_modules'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port " + server.address().port);
});

/* LOCAL DATABASE */

// var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/main', function(err) {
//     if (err)
//         throw err;

//     console.log("CONNECTED");
// });

/* WRITE */

io.sockets.on('connection', onSocketConnection);

function onSocketConnection(client) {
    // console.log("New connection %s", client.id);

    client.on('saveData', onSaveData);
    client.on('onLogin', onLogin);
    client.on('changePass', changePass);
    client.on('getScores', getScores);
    client.on('postScore', (score) => {
        console.log(score);
        postScore(score);
    });
}

function hashPassword(user) {
    var hashword = passwordHash.generate(user.password);
    user.password = hashword;
}

function onSaveData(user) {
    hashPassword(user);
    var userData = JSON.stringify(user);
    fs.writeFile("user.txt", userData, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function onLogin(user) {
    var match = readUserData();
    console.log(user);
    console.log(match);

    if (!user.username || !user.password) {
        console.log("empty credentials");
        this.emit('loginFalse');
    }
    else if (user.username == match.username && 
        passwordHash.verify(user.password, match.password)) {
        console.log("successful login");
        this.emit('loginTrue');
    }
    else {
        console.log("invalid login");
        this.emit('loginFalse');
    }
}

function getScores() {
    var user = readUserData();
    console.log(user);
    this.emit('userScores', user.highscores);
}

//remove lowest score and replace with new score
function postScore(score) {
    var user = readUserData();
    console.log("BEFORE");
    console.log(user);
    var min = 0;
    for (var i = 0; i < user.highscores.length; i++) {
        if (user.highscores[min] > user.highscores[i]) min = i;
    }
    if (user.highscores[min] < score) {
        user.highscores[min] = score;
    }
    console.log("AFTER");
    console.log(user);
    var userData = JSON.stringify(user);
    fs.writeFile("user.txt", userData, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    
}

function readUserData() {
    return JSON.parse(fs.readFileSync("user.txt", 'utf8'));
}

function changePass(newPassword) {
    var match = readUserData();
    match.password = passwordHash.generate(newPassword);
    console.log("successful password change");
    onSaveData(JSON.stringify(match));
}




