'use strict';

var DuplexStream = require('stream').Duplex
  , util = require('util')
;

// Fix prefix
window.WebSocket = window.WebSocket || window.MozWebSocket;

// Inherit of duplex stream
util.inherits(WebSocketStream, DuplexStream);

// Constructor
function WebSocketStream(uri, options) {
  var self = this;

  // Ensure new were used
  if(!(this instanceof WebSocketStream)) {
    throw Error('Please use the "new" operator to instanciate a WebSocketStream.');
  }

  // Parent constructor
  DuplexStream.call(this);

  // Setting the WebSocketClient
  var _ws = new WebSocket(uri)
    , _self = this
    , _buffer = ''
  ;

  // Input
  this._write = function _write(chunk, encoding, done) {
    var str = '';
    if(Buffer.isBuffer(chunk)) {
      str = chunk.toString(encoding !== 'buffer' ? encoding : 'utf8');
    } else {
      str = chunk;
    }
    _ws.send(str);
    done();
  };

  // Output data
  _ws.onmessage = function (message) {
    _self.push(new Buffer(message.data, 'utf8'));
  };
  this._read = function _read() {
  };

  // Manage disconnection
  _ws.onclose = function (message) {
    _self.emit('end');
  };
}

module.exports = WebSocketStream;
