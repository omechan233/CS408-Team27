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

/* Retrieve data from local JSON file */
function getJSONFromFile(filename) {
    getJSON(filename, function(response) {
        return JSON.parse(response);
    });
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

// getJSONFromFile("/server/users.json");












