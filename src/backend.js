'use strict';

var cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , VarStream = require('varstream')
  , fs = require('fs');


// Creating the shared variable tree
var rootScope = {}
  // creating the shared VarStream
  , sharedVarStream = new VarStream(rootScope, 'tree');

// Reading saved variable tree
fs.createReadStream(__dirname+'/../vars.dat').pipe(sharedVarStream,{
  end: false
});

// Master worker
if (cluster.isMaster) {

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  var messageHandler = function (msg) {
    // Processing the message
    sharedVarStream.write(msg.cnt);
    // Echoing to stdout
    process.stdout.write(msg.cnt);
    // Broadcasting to child workers
    Object.keys(cluster.workers).forEach(function(id) {
      cluster.workers[id].send(msg);
    });
  }

  // Fork ready
  cluster.on('online', function(worker, address) {
    console.log('# Worker['+worker.process.pid+'] Ready!');
    // Sending current state
    new VarStream(rootScope, 'tree').on('data', function(chunk) {
      worker.send({cnt: String(chunk)});
    });
    // Listening to messages
    cluster.workers[worker.id].on('message', messageHandler);
  });

  // Fork dying, create a new one
  cluster.on('exit', function(worker, code, signal) {
    console.log('# Worker['+worker.process.pid+'] Died!');
    cluster.fork();
  });

  // Piping stdin to the VarStream
  process.stdin.pipe(new VarStream(rootScope, 'tree'));
  // Repeating stdin to clients
  process.stdin.on('data',function(chunk) {
    // Broadcasting to child workers
    Object.keys(cluster.workers).forEach(function(id) {
      cluster.workers[id].send({cnt: String(chunk)});
    });
  });

  // Managing process exits
  process.on('SIGINT', function() {
    // Saving the current tree state
    console.log('# Saving state before exiting');
    new VarStream(rootScope, 'tree')
      .pipe(fs.createWriteStream(__dirname+'/../vars.dat'))
      .on('finish',function() {
      process.exit();
    });
  });

// In a child worker
} else {
  var WebSocketServer = require('websocket').server
    , http = require('http')
    , fs = require('fs');

  // Listening to master messages
  process.on('message', function(msg) {
    // Processing
    sharedVarStream.write(msg.cnt);
    // Repeating to each clients
    connections.forEach(function(client) {
        client.sendUTF(msg.cnt);
    });
  });

  // Starting a trivial web server
  var server = http.createServer(function(request, response) {
    var path=request.url;
    console.log('# Worker['+process.pid+']: Serving: ' + path + '\n');
    if(path.length-1 === path.lastIndexOf('/')) {
      path+='index.html';
    }
    fs.exists(__dirname + '/../www' + path, function(exists) {
      if(exists) {
        fs.createReadStream(__dirname + '/../www' + path).pipe(response);
      } else {
        response.end();
      }
    });
  });

  server.listen(1337, function() {
    console.log('# Worker['+process.pid+']: Server listening on http://127.0.0.1:1337/ \n')
  });

  // Creating the shared variable tree
  var rootScope = {}
    // creating the shared VarStream
    , sharedVarStream = new VarStream(rootScope, 'tree')
    // Keeping connections
    , connections = [];

  // Create the WebSocket server
  var wsServer = new WebSocketServer({
      httpServer: server
  });

  wsServer.on('request', function(request) {

    // New client
    var connection = request.accept(null, request.origin);
      connections.push(connection);

    // Sending him the current var tree
    new VarStream(rootScope, 'tree').on('data',function(chunk) {
      connection.sendUTF(chunk.toString()+"\n");
    });

    // Listening for inputs
    connection.on('message', function(message) {
      if(message.type === 'utf8') {
        // Sending to the master
        process.send({cnt: message.utf8Data});
      }
    });

    // Client exiting
    connection.on('close', function(connection) {
      connections.splice(connections.indexOf(connection), 1);
    });

  });
}
