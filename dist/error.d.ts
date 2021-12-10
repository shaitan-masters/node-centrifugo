import { ErrorResponse } from './types';
export declare class CentrifugeError extends Error {
    readonly message: string;
    constructor(message: string);
    get data(): ErrorResponse;
}
