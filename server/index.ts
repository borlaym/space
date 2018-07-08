import * as express from 'express';
import { Server } from 'http';
import * as socketio from 'socket.io';
import Player from './Player';

const app = express();
const http = new Server(app);
var io = socketio(http);

io.on('connection', function (socket) {
	let newPlayer = new Player(socket);
	global.console.log(`New player ${newPlayer.id} connected`);
	socket.on('disconnect', () => {
		global.console.log(`Player ${newPlayer.id} disconnected`);
	});
});

http.listen(3001, function () {
	console.log('listening on port 3001');
});