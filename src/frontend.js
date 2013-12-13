'use strict';

var VarStream = require('varstream')
  , WebSocketStream = require('./frontend/WebSocketStream')
;

// Creating the common var tree
var varTree={form: {}}
  , myVarStream = new VarStream(varTree, 'form')
  , myWSStream = new WebSocketStream('ws://127.0.0.1:1337')
;

// Parsing form inputs
[].slice.call(document.getElementsByClassName('sync'), 0).forEach(function(input) {

    // Looking for input update and synchronizing with server
    function inputListener(e) {
      if(input.value != oldValue) {
        if(0 === input.value.indexOf(oldValue)) {
          myWSStream.write(name + '+=' + input.value.substring(oldValue.length)
            .replace(/(\r?\n)/igm,'\\\n')+'\n');
          input.value = oldValue;
        } else {
          myWSStream.write(name + '=' + input.value.replace(/(\r?\n)/igm,'\\\n')
            +'\n');
        }
      }
    }

  var name, oldValue;

  if(input.hasAttribute('id')) {
    name=input.getAttribute('id');
    oldValue = input.value;

    // Linking the form element to it's vartree value
    varTree.form.__defineGetter__(name, function() {
      return input.value;
    });
    varTree.form.__defineSetter__(name, function(value) {
      input.value = oldValue = value;
    });

    // Looking for input update and synchronizing with server
    input.addEventListener('input', inputListener);
    input.addEventListener('select', inputListener);
  }
});

// Catching synchronization message
myWSStream.pipe(myVarStream, {end: false});

