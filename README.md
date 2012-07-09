WebSocketIPC
============

WebSocketIPC is a websocket server allowing you to synchronize a variable tree between each clients of the server.
It can also be used to synchronize datas beetween instances of the same NodeJS application by piping VarStreams.
It's a proof of concept of the VarStream project (git repo: https://github.com/nfroidure/VarStream ).

WebSocketIPC program is free to use for any purpose (GNU/GPL).

How to use
-------------
On your console :
<pre>
npm install varstream
npm install websocket
node websockipc.js 
</pre>

Open index.html multiple times on your browser to test WebSocketIPC synchronization.

Contributors
-------------
* Nicolas Froidure - @nfroidure

License
-------
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
