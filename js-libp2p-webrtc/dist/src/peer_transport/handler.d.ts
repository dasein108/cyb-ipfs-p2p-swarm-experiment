import type { IncomingStreamData } from '@libp2p/interface-registrar';
import type { Stream } from '@libp2p/interface-connection';
import type { StreamMuxerFactory } from '@libp2p/interface-stream-muxer';
export type IncomingStreamOpts = {
    rtcConfiguration?: RTCConfiguration;
} & IncomingStreamData;
export declare function handleIncomingStream({ rtcConfiguration, stream: rawStream }: IncomingStreamOpts): Promise<[RTCPeerConnection, StreamMuxerFactory]>;
export interface ConnectOptions {
    stream: Stream;
    signal: AbortSignal;
    rtcConfiguration?: RTCConfiguration;
}
export declare function initiateConnection({ rtcConfiguration, signal, stream: rawStream }: ConnectOptions): Promise<[RTCPeerConnection, StreamMuxerFactory]>;
//# sourceMappingURL=handler.d.ts.map