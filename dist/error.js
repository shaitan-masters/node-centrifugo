"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentrifugeError = void 0;
class CentrifugeError extends Error {
    message;
    constructor(message) {
        super(message);
    }
    get data() {
        try {
            const { error } = JSON.parse(this.message);
            return error;
        }
        catch (e) {
            return {
                code: -1,
                message: this.message
            };
        }
    }
}
exports.CentrifugeError = CentrifugeError;
//# sourceMappingURL=error.js.map