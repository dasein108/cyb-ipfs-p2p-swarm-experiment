import { CodeError } from '@libp2p/interfaces/errors';
export var codes;
(function (codes) {
    codes["ERR_ALREADY_ABORTED"] = "ERR_ALREADY_ABORTED";
    codes["ERR_DATA_CHANNEL"] = "ERR_DATA_CHANNEL";
    codes["ERR_CONNECTION_CLOSED"] = "ERR_CONNECTION_CLOSED";
    codes["ERR_HASH_NOT_SUPPORTED"] = "ERR_HASH_NOT_SUPPORTED";
    codes["ERR_INVALID_MULTIADDR"] = "ERR_INVALID_MULTIADDR";
    codes["ERR_INVALID_FINGERPRINT"] = "ERR_INVALID_FINGERPRINT";
    codes["ERR_INVALID_PARAMETERS"] = "ERR_INVALID_PARAMETERS";
    codes["ERR_NOT_IMPLEMENTED"] = "ERR_NOT_IMPLEMENTED";
    codes["ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS"] = "ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS";
    codes["ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS"] = "ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS";
})(codes || (codes = {}));
export class WebRTCTransportError extends CodeError {
    constructor(msg, code) {
        super(`WebRTC transport error: ${msg}`, code ?? '');
        this.name = 'WebRTCTransportError';
    }
}
export class ConnectionClosedError extends WebRTCTransportError {
    constructor(state, msg) {
        super(`peerconnection moved to state: ${state}: ${msg}`, codes.ERR_CONNECTION_CLOSED);
        this.name = 'WebRTC/ConnectionClosed';
    }
}
export function connectionClosedError(state, msg) {
    return new ConnectionClosedError(state, msg);
}
export class DataChannelError extends WebRTCTransportError {
    constructor(streamLabel, msg) {
        super(`[stream: ${streamLabel}] data channel error: ${msg}`, codes.ERR_DATA_CHANNEL);
        this.name = 'WebRTC/DataChannelError';
    }
}
export function dataChannelError(streamLabel, msg) {
    return new DataChannelError(streamLabel, msg);
}
export class InappropriateMultiaddrError extends WebRTCTransportError {
    constructor(msg) {
        super(`There was a problem with the Multiaddr which was passed in: ${msg}`, codes.ERR_INVALID_MULTIADDR);
        this.name = 'WebRTC/InappropriateMultiaddrError';
    }
}
export function inappropriateMultiaddr(msg) {
    return new InappropriateMultiaddrError(msg);
}
export class InvalidArgumentError extends WebRTCTransportError {
    constructor(msg) {
        super(`There was a problem with a provided argument: ${msg}`, codes.ERR_INVALID_PARAMETERS);
        this.name = 'WebRTC/InvalidArgumentError';
    }
}
export function invalidArgument(msg) {
    return new InvalidArgumentError(msg);
}
export class InvalidFingerprintError extends WebRTCTransportError {
    constructor(fingerprint, source) {
        super(`Invalid fingerprint "${fingerprint}" within ${source}`, codes.ERR_INVALID_FINGERPRINT);
        this.name = 'WebRTC/InvalidFingerprintError';
    }
}
export function invalidFingerprint(fingerprint, source) {
    return new InvalidFingerprintError(fingerprint, source);
}
export class OperationAbortedError extends WebRTCTransportError {
    constructor(context, abortReason) {
        super(`Signalled to abort because (${abortReason}}) ${context}`, codes.ERR_ALREADY_ABORTED);
        this.name = 'WebRTC/OperationAbortedError';
    }
}
export function operationAborted(context, reason) {
    return new OperationAbortedError(context, reason);
}
export class OverStreamLimitError extends WebRTCTransportError {
    constructor(msg) {
        const code = msg.startsWith('inbound') ? codes.ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS : codes.ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS;
        super(msg, code);
        this.name = 'WebRTC/OverStreamLimitError';
    }
}
export function overStreamLimit(dir, proto) {
    return new OverStreamLimitError(`${dir} stream limit reached for protocol - ${proto}`);
}
export class UnimplementedError extends WebRTCTransportError {
    constructor(methodName) {
        super(`A method (${methodName}) was called though it has been intentionally left unimplemented.`, codes.ERR_NOT_IMPLEMENTED);
        this.name = 'WebRTC/UnimplementedError';
    }
}
export function unimplemented(methodName) {
    return new UnimplementedError(methodName);
}
export class UnsupportedHashAlgorithmError extends WebRTCTransportError {
    constructor(algo) {
        super(`unsupported hash algorithm: ${algo}`, codes.ERR_HASH_NOT_SUPPORTED);
        this.name = 'WebRTC/UnsupportedHashAlgorithmError';
    }
}
export function unsupportedHashAlgorithm(algorithm) {
    return new UnsupportedHashAlgorithmError(algorithm);
}
//# sourceMappingURL=error.js.map