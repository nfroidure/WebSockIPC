WebSocketIPC
============

** Abandonated: ** I'm not doing to maintain this project anymore, i'll just leave it here for historical reasons. Feel free to reuse it according to its license.

WebSocketIPC is a websocket server allowing you to synchronize a variable tree
 between each clients of the server.

It also synchronize the variable tree beetween each worker of the cluster (one
 per CPU).

Finally, it allows you to pipe a Unix VarStream in and out or to simply
 visualize the stream in the console and manually type VarStream content from
 your console.

It's a proof of concept of the
 [VarStream project](https://github.com/nfroidure/VarStream).

WebSocketIPC program is free to use for any purpose (GNU/GPL).

How to use
-------------
On your console :
```sh
npm install
node src/backend.js
```

Build
-------------
To build the front-end  :
```sh
npm install -g browserify
node_modules/browserify/bin/cmd.js src/frontend.js -o www/javascript/script.js 
```
Note: The Grunt plug-in currently embed an old browserify version. It should
 work when updated.

Test
-------------
Open index.html multiple times on your browsers to test WebSocketIPC
 synchronization.

Contributors
-------------
* Nicolas Froidure - @nfroidure

License
-------
This program is free software: you can redistribute it and/or modify it under
 the terms of the GNU General Public License as published by the Free Software
 Foundation, either version 3 of the License, or (at your option) any later
 version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
 this program.  If not, see <http://www.gnu.org/licenses/>

