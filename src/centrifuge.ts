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
	CentrifugoHeaders
} from './types';

export class Centrifuge {
	protected readonly config: Config;
	protected readonly http: AxiosInstance;

	protected static METHOD: { [key in Uppercase<Method>]: Method } = {
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

	constructor(config: Config) {
		this.config = config;
		this.http = this.buildHttp(axios.create());
	}

	protected buildHttp(http: AxiosInstance): AxiosInstance {
		http.defaults.baseURL = this.config.endpoint;
		http.defaults.headers = {
			authorization: `apikey ${this.config.token}`
		} as CentrifugoHeaders;

		http.interceptors.response.use(response => {
			if ('error' in response.data) {
				throw new CentrifugeError(JSON.stringify(response.data));
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
}
