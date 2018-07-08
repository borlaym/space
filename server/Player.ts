import { v4 as uuid } from 'uuid';

export default class Player {
	public socket: SocketIO.Socket;
	public id: string;
	public state: {
		x: number,
		y: number,
		z: number
	}
	constructor(socket: SocketIO.Socket) {
		this.socket = socket;
		this.id = uuid();
	}

	get shortId() {
		return this.id.split('-')[0];
	}
}