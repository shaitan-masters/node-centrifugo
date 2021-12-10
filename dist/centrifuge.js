"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Centrifuge = void 0;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("./error");
class Centrifuge {
    config;
    http;
    static METHOD = {
        PUBLISH: 'publish',
        BROADCAST: 'broadcast',
        SUBSCRIBE: 'subscribe',
        UNSUBSCRIBE: 'unsubscribe',
        DISCONNECT: 'disconnect',
        PRESENCE: 'presence',
        PRESENCE_STATS: 'presence_stats',
        HISTORY: 'history',
        HISTORY_REMOVE: 'history_remove',
        CHANNELS: 'channels',
        REFRESH: 'refresh',
        INFO: 'info'
    };
    constructor(config) {
        this.config = config;
        this.http = this.buildHttp(axios_1.default.create());
    }
    buildHttp(http) {
        http.defaults.baseURL = this.config.endpoint;
        http.defaults.headers = {
            authorization: `apikey ${this.config.token}`
        };
        http.interceptors.response.use(response => {
            if ('error' in response.data) {
                throw new error_1.CentrifugeError(JSON.stringify(response.data));
            }
            return response.data.result;
        });
        return http;
    }
    async request(method, params = {}) {
        return this.http.post('api', { method, params });
    }
    async publish(channel, data) {
        return this.request(Centrifuge.METHOD.PUBLISH, { channel, data });
    }
    async subscribe(channel, user) {
        return this.request(Centrifuge.METHOD.SUBSCRIBE, { channel, user });
    }
    async broadcast(channel, data) {
        return this.request(Centrifuge.METHOD.BROADCAST, { channel, data });
    }
    async presence(channel) {
        return this.request(Centrifuge.METHOD.PRESENCE, { channel });
    }
    async presenceStats(channel) {
        return this.request(Centrifuge.METHOD.PRESENCE_STATS, { channel });
    }
    async history(channel, limit = 0) {
        return this.request(Centrifuge.METHOD.HISTORY, { channel, limit });
    }
    async historyRemove(channel) {
        return this.request(Centrifuge.METHOD.HISTORY_REMOVE, { channel });
    }
    async channels(channel = '') {
        return this.request(Centrifuge.METHOD.CHANNELS, { pattern: channel });
    }
    async unsubscribe(channel, user) {
        return this.request(Centrifuge.METHOD.UNSUBSCRIBE, { channel, user });
    }
    async disconnect(user) {
        return this.request(Centrifuge.METHOD.DISCONNECT, { user });
    }
    async refresh(user, client, expireAt) {
        return this.request(Centrifuge.METHOD.REFRESH, { user, client, expire_at: expireAt });
    }
    async info() {
        return this.request(Centrifuge.METHOD.INFO);
    }
}
exports.Centrifuge = Centrifuge;
//# sourceMappingURL=centrifuge.js.map