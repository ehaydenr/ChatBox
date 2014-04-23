var socket = io.connect('/'),
	username = "";

$(document).ready(function (){
	username = prompt("Please enter your name");

	socket.on('incoming_message', function (message) {
    $('.output').append($.parseHTML('<strong>'+message.username+'</strong>' + ": " + message.content + "<br />"));
		$('.output').scrollTop($('.output')[0].scrollHeight);
	});

	sendMessage("Hi! I just joined");

	$('.input').on('keypress', function (event) {
		if(event.keyCode == 13){
			event.preventDefault();
			sendMessage($(this).val());
			$(this).val('');
		}
	});
});

function sendMessage(content){
	socket.emit('relay_me', {username:username, content:content});
}
