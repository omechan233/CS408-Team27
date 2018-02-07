/* Primary helper functions for game-to-server handling */

/*
 *
 * TODO: Implement local and remote databases
 *
 * Create a Mongo database to store data locally
 * Send stored local Mongo database to server cloud when user is connected to network
 *
 */

// TEMPORARY HELPER FUNCTIONS

/* Save user object to local storage as JSON */

var user = {
    username: "",
    password: "",
    highscore: "",
    scores,
    rewards
}

var jsonUser = JSON.stringify(user);

function saveUserData(user) {
   var fs = require('fs');
   fs.writeFile("user.txt", jsonUser, function(err) {
       if (err) {
           return console.log(err);
       }
   });
}

/* Retrieve user object */
function getUserData() {
    return JSON.parse(localStorage.getItem('user'));
}

/* Retrieve data from local JSON file */
function getJSONFromFile(filename) {
    getJSON(filename, function(response) {
        console.log("JSON Data from %s", filename);
        console.log(JSON.parse(response));
    })
}

/* Helper function for getJSONFromFile() */
function getJSON(filename, callback) {
    var xml = new XMLHttpRequest();
    xml.open('GET', filename, true);
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && xml.status == "200")
            callback(xml.responseText);
    }
    xml.send(null);
}

// TEST DRIVERS

getJSONFromFile("/server/users.json");












