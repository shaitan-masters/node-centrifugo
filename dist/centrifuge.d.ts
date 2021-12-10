import { AxiosInstance } from 'axios';
import { Config, Method, Payload, BaseResponse, BroadcastResponse, PresenceResponse, PresenceStatsResponse, HistoryResponse, ChannelsResponse, InfoResponse } from './types';
export declare class Centrifuge {
    protected readonly config: Config;
    protected readonly http: AxiosInstance;
    protected static METHOD: {
        [key in Uppercase<Method>]: Method;
    };
    constructor(config: Config);
    protected buildHttp(http: AxiosInstance): AxiosInstance;
    protected request<T>(method: Method, params?: Payload): Promise<T>;
    publish(channel: string, data: Payload): Promise<BaseResponse>;
    subscribe(channel: string, user: string): Promise<{}>;
    broadcast(channel: string, data: Payload): Promise<BroadcastResponse>;
    presence(channel: string): Promise<PresenceResponse>;
    presenceStats(channel: string): Promise<PresenceStatsResponse>;
    history(channel: string, limit?: number): Promise<HistoryResponse>;
    historyRemove(channel: string): Promise<{}>;
    channels(channel?: string): Promise<ChannelsResponse>;
    unsubscribe(channel: string, user: string): Promise<{}>;
    disconnect(user: string): Promise<{}>;
    refresh(user: string, client: string, expireAt: number): Promise<{}>;
    info(): Promise<InfoResponse>;
}
