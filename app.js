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

/* MONGO DATABASE */
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://ark:graybannan@ds023468.mlab.com:23468/main";

io.sockets.on('connection', onSocketConnection);

function onSocketConnection(client) {
    // console.log("New connection %s", client.id);

    client.on('saveData', onSaveData);
    client.on('onLogin', onLogin);
    client.on('checkSignup', checkSignup);
    client.on('changePass', changePass);
    client.on('getLocalScores', getLocalScores);
    client.on('getGlobalScores', getGlobalScores);
    client.on('postScore', (score) => {
        postScore(score);
    });
}

function hashPassword(user) {
    var hashword = passwordHash.generate(user.password);
    user.password = hashword;
}

function onSaveData(user) {
    hashPassword(user);
    console.log(user);
    var userData = JSON.stringify(user);
    fs.writeFile("user.txt", userData, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    sendUserMongo(user);
}

function onLogin(user) {
    if (!user.username || !user.password) {
        console.log("empty credentials");
        this.emit('loginFalse');
        return;
    }

    currentClient = this;

    MongoClient.connect(uri, function(err, db) {
        if (err)
            throw err;

        db.collection("users").find(
            {username: user.username}
        ).toArray(function(err, docs) {
            for (var i = 0; i < docs.length; i++) {
                if (passwordHash.verify(user.password, docs[i].password)) {
                    console.log("successful login");
                    currentClient.emit('loginTrue');
                    return;
                }
            }
            console.log("invalid login");
            currentClient.emit('loginFalse');
        });
    });
}

function checkSignup(user) {
    currentClient = this;
    MongoClient.connect(uri, function(err, db) {
        if (err)
            throw err;

        db.collection("users").find(
            {username: user.username}
        ).toArray(function(err, docs) {
            // username taken
            if (docs.length > 0) {
                currentClient.emit('signupFalse');
            }
            else {
                currentClient.emit('signupTrue');
            }
        });
    });
}

function getLocalScores() {
    var user = readUserData();
    this.emit('localScores', user.highscores);
}

function getGlobalScores() {
    currentClient = this;

    MongoClient.connect(uri, function(err, db) {
        if (err)
            throw err;

        db.collection("users").find({}).toArray(function(err, results) {
            topScores = [];
            // get the best 10 highscores from all users
            for (var i = 0; i < results.length; i++) {
                user = results[i];
                for (var j = 0; j < user.highscores.length; j++) {
                    item = {
                        username: user.username,
                        highscore: user.highscores[j]
                    }
                    topScores.push(item);
                }
            }
            topScores.sort((a, b) => {
                return b.highscore - a.highscore;
            });
            topScores = topScores.slice(0, 10);
            currentClient.emit('globalScores', topScores);
        });
    });
}

function sendUserMongo(user) {
    MongoClient.connect(uri, function(err, db) {
        if (err)
            throw err;

        db.collection("users").update(
            {username: user.username}, 
            user,
            {
                upsert: true
            }
        );
    });
}

function postScore(score) {
    var user = readUserData();
    user.highscores.push(score);
    user.highscores.sort((a, b) => {
        return b - a;
    });
    user.highscores = user.highscores.slice(0, 5);
    var userData = JSON.stringify(user);
    fs.writeFile("user.txt", userData, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    sendUserMongo(user);
}

function readUserData() {
    return JSON.parse(fs.readFileSync("user.txt", 'utf8'));
}

function changePass(newPassword) {
    var match = readUserData();
    match.password = newPassword;
    onSaveData(match);
}




