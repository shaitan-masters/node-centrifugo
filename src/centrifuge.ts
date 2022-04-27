import axios, {AxiosInstance} from 'axios';
import {CentrifugeError} from './error';
import {
	Config,
	Method,
	Payload,
	BaseResponse,
	BroadcastResponse,
	PresenceResponse,
	PresenceStatsResponse,
	HistoryResponse,
	ChannelsResponse,
	InfoResponse,
	CentrifugoHeaders,
	CentrifugoMethods
} from './types';

export class Centrifuge {
	protected readonly config: Config;
	protected readonly http: AxiosInstance;

	private readonly dumpResponseData: boolean;

	protected static METHOD: CentrifugoMethods = {
		PUBLISH       : 'publish',
		BROADCAST     : 'broadcast',
		SUBSCRIBE     : 'subscribe',
		UNSUBSCRIBE   : 'unsubscribe',
		DISCONNECT    : 'disconnect',
		PRESENCE      : 'presence',
		PRESENCE_STATS: 'presence_stats',
		HISTORY       : 'history',
		HISTORY_REMOVE: 'history_remove',
		CHANNELS      : 'channels',
		REFRESH       : 'refresh',
		INFO          : 'info'
	};

	constructor(config: Config, dumpResponseData: boolean = false) {
		this.config = config;
		this.dumpResponseData = dumpResponseData;

		if (!this.config.endpoint) throw new Error('config.endpoint is empty');
		if (!this.config.token) throw new Error('config.token is empty');

		this.http = this.buildHttp(axios.create());
	}

	protected buildHttp(http: AxiosInstance): AxiosInstance {
		http.defaults.baseURL = this.config.endpoint;
		http.defaults.headers = {
			authorization: `apikey ${this.config.token}`
		} as CentrifugoHeaders;

		http.interceptors.response.use(response => {
			if (this.dumpResponseData) console.log(response.data);

			if (!response?.data) {
				throw new CentrifugeError(JSON.stringify({
					code   : -2,
					message: 'Empty response'
				}));
			}

			if ('error' in response.data) {
				let serialized: string;
				try {
					serialized = JSON.stringify(response.data.error);
				} catch (e) {
					serialized = JSON.stringify({
						code   : -3,
						message: 'Cant serialize error message'
					});
				}

				throw new CentrifugeError(serialized);
			}

			return response.data.result;
		});

		return http;
	}

	protected async request<T>(method: Method, params: Payload = {}): Promise<T> {
		return this.http.post('api', {
			method,
			params
		});
	}

	public async publish(channel: string, data: Payload): Promise<BaseResponse> {
		return this.request(Centrifuge.METHOD.PUBLISH, {
			channel,
			data
		});
	}

	public async subscribe(channel: string, user: string): Promise<{}> {
		return this.request(Centrifuge.METHOD.SUBSCRIBE, {
			channel,
			user
		});
	}

	public async broadcast(channel: string, data: Payload): Promise<BroadcastResponse> {
		return this.request(Centrifuge.METHOD.BROADCAST, {
			channel,
			data
		});
	}

	public async presence(channel: string): Promise<PresenceResponse> {
		return this.request(Centrifuge.METHOD.PRESENCE, {
			channel
		});
	}

	public async presenceStats(channel: string): Promise<PresenceStatsResponse> {
		return this.request(Centrifuge.METHOD.PRESENCE_STATS, {
			channel
		});
	}

	public async history(channel: string, limit: number = 0): Promise<HistoryResponse> {
		return this.request(Centrifuge.METHOD.HISTORY, {
			channel,
			limit
		});
	}

	public async historyRemove(channel: string): Promise<{}> {
		return this.request(Centrifuge.METHOD.HISTORY_REMOVE, {
			channel
		});
	}

	public async channels(channel: string = ''): Promise<ChannelsResponse> {
		return this.request(Centrifuge.METHOD.CHANNELS, {
			pattern: channel
		});
	}

	public async unsubscribe(channel: string, user: string): Promise<{}> {
		return this.request(Centrifuge.METHOD.UNSUBSCRIBE, {
			channel,
			user
		});
	}

	public async disconnect(user: string): Promise<{}> {
		return this.request(Centrifuge.METHOD.DISCONNECT, {
			user
		});
	}

	public async refresh(user: string, client: string, expireAt: number): Promise<{}> {
		return this.request(Centrifuge.METHOD.REFRESH, {
			user,
			client,
			expire_at: expireAt
		});
	}

	public async info(): Promise<InfoResponse> {
		return this.request(Centrifuge.METHOD.INFO);
	}

	public async healthCheck(): Promise<boolean> {
		try {
			const res = await this.info();

			return !!res.nodes.length;
		} catch (e) {
			return false;
		}
	}
}
