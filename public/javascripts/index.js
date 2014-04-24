// Startup websocket connection
var socket = io.connect('/'),
	username = "";

$(document).ready(function (){

	// Get username from client
	username = prompt("Please enter your name");

	// Define callback for when a message is sent over websockets
	socket.on('incoming_message', function (message) {

		// Append the output window with the message. Prevent javascript injection
    	$('.output').append($.parseHTML('<strong>'+message.username+'</strong>' + ": " + message.content + "<br />"));

    	// Scroll the div to the most recently appended message
		$('.output').scrollTop($('.output')[0].scrollHeight);
	});

	// Let everyone know you joined the chat server. It is client side and easily removable but it is not a security risk.
	sendMessage("Hi! I just joined");

	// Get input text when the user hits the enter key
	$('.input').on('keypress', function (event) {
		if(event.keyCode == 13){
			event.preventDefault();

			// Send message containing the value of the input box
			sendMessage($(this).val());

			// Clear the value of the input box
			$(this).val('');
		}
	});
});

// Send message to the server with my username and message. Username forgery is easy but lets not worry about that for now. We can handle with sessions later
function sendMessage(content){
	socket.emit('relay_me', {username:username, content:content});
}
