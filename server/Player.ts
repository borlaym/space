import { v4 as uuid } from 'uuid';

export default class Player {
	public socket: SocketIO.Socket;
	public id: string;
	public state: {
		x: number,
		y: number,
		z: number
	}
	public lastActivity: number;
	constructor(socket: SocketIO.Socket) {
		this.socket = socket;
		this.id = uuid();
		this.lastActivity = Date.now();
	}

	public didActivate() {
		this.lastActivity = Date.now();
	}

	get isActive() {
		return Date.now() - this.lastActivity < 10 * 1000;
	}

	get shortId() {
		return this.id.split('-')[0];
	}
}