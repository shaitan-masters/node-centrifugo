import {ErrorResponse} from './types';

export class CentrifugeError extends Error {
	readonly message: string;

	constructor(message: string) {
		super(message);
		
		this.message = message;
	}

	public get data(): ErrorResponse {
		try {
			return JSON.parse(this.message);
		} catch (e) {
			return {
				code   : -1,
				message: `Cant parse message: ${this.message}`
			};
		}
	}
}
