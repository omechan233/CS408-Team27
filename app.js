var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('file-system');

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
    console.log("New connection %s", client.id);

    client.on('saveData', onSaveData);
}

function onSaveData(jsonUser) {
    fs.writeFile("user.txt", jsonUser, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}





