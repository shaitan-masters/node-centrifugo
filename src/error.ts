import {ErrorResponse} from './types';

export class CentrifugeError extends Error {
	readonly message: string;

	constructor(message: string) {
		super(message);
	}

	public get data(): ErrorResponse {
		try {
			const {error} = JSON.parse(this.message);

			return error;
		} catch (e) {
			return {
				code   : -1,
				message: this.message
			};
		}
	}
}
