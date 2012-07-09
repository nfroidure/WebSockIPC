// Websockets management largely inpired from : http://martinsikora.com/nodejs-and-websocket-simple-chat-tutorial

var VarStream = require('varstream');
var WebSocketServer = require('websocket').server;
var http = require('http');

// Creating the share variable tree
var varTree={};
var vsReader=new VarStream.VarStreamReader(varTree);
var clients = [ ];

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(1337, function() { });

// Create the WebSocket server
wsServer = new WebSocketServer({
    httpServer: server
});

// Handling connection requests
wsServer.on('request', function(request)
	{
    var connection = request.accept(null, request.origin);
	
	console.log('New client');
	clients.push(connection);
	console.log('- Sending him current variable tree');
	var vsWriter=new VarStream.VarStreamWriter(function(chunk)
		{
		connection.sendUTF(chunk);
		},true,false);
	vsWriter.write(varTree);
	console.log(varTree);
	delete vsWriter;
    // Registering message callback
    connection.on('message', function(message)
		{
        if (message.type === 'utf8')
			{
			console.log('New message :'+"\n"+message.utf8Data);
			// Reading streamed vars
			vsReader.read(message.utf8Data);
			// Could also append each messages to a log file to be able to reload it at next start
			// Repeating to clients
			for (var i=clients.length-1; i>=0; i--)
				{
				if(clients[i]!=connection)
					clients[i].sendUTF(message.utf8Data+"\n");
				}
			}
		});

    connection.on('close', function(connection)
		{
        // Close user connection
		clients.splice(clients.indexOf(connection), 1);
		});
});