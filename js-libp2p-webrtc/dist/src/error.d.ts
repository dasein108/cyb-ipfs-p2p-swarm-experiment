import { CodeError } from '@libp2p/interfaces/errors';
import type { Direction } from '@libp2p/interface-connection';
export declare enum codes {
    ERR_ALREADY_ABORTED = "ERR_ALREADY_ABORTED",
    ERR_DATA_CHANNEL = "ERR_DATA_CHANNEL",
    ERR_CONNECTION_CLOSED = "ERR_CONNECTION_CLOSED",
    ERR_HASH_NOT_SUPPORTED = "ERR_HASH_NOT_SUPPORTED",
    ERR_INVALID_MULTIADDR = "ERR_INVALID_MULTIADDR",
    ERR_INVALID_FINGERPRINT = "ERR_INVALID_FINGERPRINT",
    ERR_INVALID_PARAMETERS = "ERR_INVALID_PARAMETERS",
    ERR_NOT_IMPLEMENTED = "ERR_NOT_IMPLEMENTED",
    ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS = "ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS",
    ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS = "ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS"
}
export declare class WebRTCTransportError extends CodeError {
    constructor(msg: string, code?: string);
}
export declare class ConnectionClosedError extends WebRTCTransportError {
    constructor(state: RTCPeerConnectionState, msg: string);
}
export declare function connectionClosedError(state: RTCPeerConnectionState, msg: string): ConnectionClosedError;
export declare class DataChannelError extends WebRTCTransportError {
    constructor(streamLabel: string, msg: string);
}
export declare function dataChannelError(streamLabel: string, msg: string): DataChannelError;
export declare class InappropriateMultiaddrError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare function inappropriateMultiaddr(msg: string): InappropriateMultiaddrError;
export declare class InvalidArgumentError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare function invalidArgument(msg: string): InvalidArgumentError;
export declare class InvalidFingerprintError extends WebRTCTransportError {
    constructor(fingerprint: string, source: string);
}
export declare function invalidFingerprint(fingerprint: string, source: string): InvalidFingerprintError;
export declare class OperationAbortedError extends WebRTCTransportError {
    constructor(context: string, abortReason: string);
}
export declare function operationAborted(context: string, reason: string): OperationAbortedError;
export declare class OverStreamLimitError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare function overStreamLimit(dir: Direction, proto: string): OverStreamLimitError;
export declare class UnimplementedError extends WebRTCTransportError {
    constructor(methodName: string);
}
export declare function unimplemented(methodName: string): UnimplementedError;
export declare class UnsupportedHashAlgorithmError extends WebRTCTransportError {
    constructor(algo: string);
}
export declare function unsupportedHashAlgorithm(algorithm: string): UnsupportedHashAlgorithmError;
//# sourceMappingURL=error.d.ts.map