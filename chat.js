// Grab all dependencies
var express = require('express'),
	app		= express(),
	http	= require('http'),
	path	= require('path');

// Create server
var server	= http.createServer(app);

// Socket Map 
// Key: 	socket.id 
// Value: 	socket
var sockets = {};

// Configure Express
app.configure(function (){

	// Tell express where the views are
	app.set('views', 'views/');

	// Tell express what view engine we are going to use
	app.set('view engine', 'jade');

	// Give express the path to the public files (javascripts and css files to be given to client)
	app.use(express.static(path.resolve('./public')));
});

// Define the root path of the website. This is called when http://mydomain.com/ is called
app.get('/', function (req, res) {

	// res is the response variable. Tell it to render the index supplied in the views folder. It knows to check the views folder because of the Express configuration we defined above.
    res.render('index');
});

// Startup the server and let the requests roll in
server.listen(3000);

// Listen for websocket interactions
var io = require('socket.io').listen(server);

//Startup websocket listeners and callbacks with socket.io

// Listen for a connection made with client. Trigger callback when made
io.sockets.on('connection', function (socket) {

	console.log("New websocket connection: " + socket.id);

	// Connection made, add the socket to the map of socket ids to sockets
	sockets[socket.id] = socket;

	// Listen for incoming messages with the title 'relay_me'
	socket.on('relay_me', function (message) {

		// TODO: Filter or verify message.

		// Relay me has been triggered. Go ahead and send the message out to everyone
		for(s in sockets){
			if(sockets[s])
				sockets[s].emit("incoming_message", message);	// Send out message
			else console.log("Broken Socket");	// For some reason the socket.id was in our map but the socket was broken.
		}
	});

	// Connection with client disconnected listener
    socket.on('disconnect', function(){
        console.log('Removing: ' + socket.id);

        // Delete socket id from map. We won't interact with them anymore.
        delete sockets[socket.id];
    });

});

