import * as express from 'express';
import { Server } from 'http';
import * as socketio from 'socket.io';
import Player from './Player';

const app = express();
const http = new Server(app);
const io = socketio(http);

let players: Player[] = [];

io.on('connection', (socket) => {
	const player = new Player(socket);
	players.push(player);
	global.console.log(`New player ${player.shortId} connected`);
	socket.on('disconnect', () => {
		global.console.log(`Player ${player.shortId} disconnected`);
		players = players.filter(p => p !== player);
		socket.broadcast.emit('disconnectedPlayer', {
			player: player.shortId
		});
	});
	socket.on('state', (state) => {
		player.state = state;
		socket.broadcast.emit('state', {
			player: player.shortId,
			...state
		});
		player.didActivate();
	});
	socket.broadcast.emit('newPlayer', {
		player: player.shortId
	});
	socket.emit('existingPlayers', {
		players: players.filter(p => p !== player).map(p => ({
			player: player.shortId,
			...player.state
		})),
		yourName: player.shortId
	});
});

function detectInactivePlayers() {
	players.forEach(player => {
		if (!player.isActive) {
			global.console.log(`Player ${player.shortId} timed out`);
			players = players.filter(p => p !== player);
			player.socket.emit('disconnect');
			player.socket.broadcast.emit('disconnectedPlayer', {
				player: player.shortId
			});
		}
	});
}

setInterval(detectInactivePlayers, 100);

const port = process.env.PORT || 3001;

http.listen(port, () => {
	global.console.log(`listening on port ${port}`);
});