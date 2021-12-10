import {ErrorResponse} from './types';


export class CentrifugeError extends Error {

	readonly message: string;

	constructor(message: string) {
		super(message);
	}

	public get data(): ErrorResponse {
		const {error} = JSON.parse(this.message);
		return error;
	}
}
