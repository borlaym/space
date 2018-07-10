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
	console.log(`New player ${player.shortId} connected`);
	socket.on('disconnect', () => {
		console.log(`Player ${player.shortId} disconnected`);
		players = players.filter(p => p !== player);
	});
	socket.on('state', (state) => {
		player.state = state;
		player.didActivate();
	});
	socket.emit('init', {
		name: player.shortId
	});
});

function detectInactivePlayers() {
	players.forEach(player => {
		if (!player.isActive) {
			console.log(`Player ${player.shortId} timed out`);
			players = players.filter(p => p !== player);
		}
	});
}

function sendGameState() {
	players.forEach(player => {
		const gameState = {
			players: players.filter(p => p !== player).map(p => ({
				name: p.shortId,
				...p.state
			}))
		};
		player.socket.emit('gameState', gameState);
	});
}

setInterval(sendGameState, 1000/60);
setInterval(detectInactivePlayers, 100);

const port = process.env.PORT || 3001;

http.listen(port, () => {
	console.log(`listening on port ${port}`);
});