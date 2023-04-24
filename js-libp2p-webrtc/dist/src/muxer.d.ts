import type { Stream } from '@libp2p/interface-connection';
import type { StreamMuxer, StreamMuxerFactory, StreamMuxerInit } from '@libp2p/interface-stream-muxer';
import type { Source, Sink } from 'it-stream-types';
export declare class DataChannelMuxerFactory implements StreamMuxerFactory {
    readonly protocol: string;
    /**
     * WebRTC Peer Connection
     */
    private readonly peerConnection;
    private streamBuffer;
    constructor(peerConnection: RTCPeerConnection, protocol?: string);
    createStreamMuxer(init?: StreamMuxerInit | undefined): StreamMuxer;
}
/**
 * A libp2p data channel stream muxer
 */
export declare class DataChannelMuxer implements StreamMuxer {
    readonly protocol: string;
    /**
     * WebRTC Peer Connection
     */
    private readonly peerConnection;
    /**
     * Array of streams in the data channel
     */
    streams: Stream[];
    /**
     * Initialized stream muxer
     */
    init?: StreamMuxerInit;
    /**
     * Close or abort all tracked streams and stop the muxer
     */
    close: (err?: Error | undefined) => void;
    /**
     * The stream source, a no-op as the transport natively supports multiplexing
     */
    source: Source<Uint8Array>;
    /**
     * The stream destination, a no-op as the transport natively supports multiplexing
     */
    sink: Sink<Uint8Array, Promise<void>>;
    constructor(peerConnection: RTCPeerConnection, streams: Stream[], protocol?: string, init?: StreamMuxerInit);
    newStream(): Stream;
    private wrapStreamEnd;
}
//# sourceMappingURL=muxer.d.ts.map