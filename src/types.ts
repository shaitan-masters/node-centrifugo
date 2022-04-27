import {HeadersDefaults} from 'axios';

export interface Config {
	readonly endpoint: string;
	readonly token: string;
}

export type Method = 'publish'
                     | 'broadcast'
                     | 'subscribe'
                     | 'unsubscribe'
                     | 'disconnect'
                     | 'presence'
                     | 'presence_stats'
                     | 'history'
                     | 'history_remove'
                     | 'channels'
                     | 'refresh'
                     | 'info';

export type Payload<T = {}> = T;

export interface BaseResponse {
	readonly offset: number;
	readonly epoch: string;
}

export interface HistoryResponse extends BaseResponse {
	readonly publications: {
		readonly data: any;
		readonly offset: number;
	}[];
}

export interface BroadcastResponse {
	readonly responses: BaseResponse[];
}

export interface PresenceResponse {
	readonly presence: {
		readonly [uuid: string]: {
			readonly user: string;
			readonly client: string;
		};
	};
}

export interface PresenceStatsResponse {
	readonly num_clients: number;
	readonly num_users: number;
}

export interface ChannelsResponse {
	readonly channels: {
		readonly [channel: string]: {
			readonly num_clients: number;
		};
	};
}

export interface InfoResponse {
	readonly nodes: Node[];
}

export interface Node {
	readonly uid: string;
	readonly name: string;
	readonly version: string;
	readonly num_clients: number;
	readonly num_users: number;
	readonly num_channels: number;
	readonly uptime: number;
	readonly metrics: Metrics;
	readonly num_subs: number;
}

export interface Metrics {
	readonly interval: number;
	readonly items: { [key: string]: number; };
}

export interface ErrorResponse {
	readonly code: number;
	readonly message: string;
}

export type CentrifugoHeaders = HeadersDefaults & {
	authorization: string;
}

export type CentrifugoMethods = { [key in Uppercase<Method>]: Method };