var express = require('express'),
	app		= express(),
	http	= require('http'),
	server	= http.createServer(app),
	path	= require('path'),
	io		= require('socket.io').listen(server);

var sockets = {};

server.listen(3000);

app.configure(function (){
	app.set('views', 'views/');
	app.set('view engine', 'jade');
	app.use(express.static(path.resolve('./public')));
});

app.get('/', function (req, res) {
	res.render('index');
});

io.sockets.on('connection', function (socket) {

	sockets[socket.id] = socket;

	socket.on('relay_me', function (message) {
		for(s in sockets){
			if(sockets[s])
				sockets[s].emit("incoming_message", message);
			else console.log("Broken Socket");
		}
	});

});