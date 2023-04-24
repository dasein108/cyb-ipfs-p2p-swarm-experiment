import type { MultiaddrConnection, MultiaddrConnectionTimeline } from '@libp2p/interface-connection';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { Source, Sink } from 'it-stream-types';
interface WebRTCMultiaddrConnectionInit {
    /**
     * WebRTC Peer Connection
     */
    peerConnection: RTCPeerConnection;
    /**
     * The multiaddr address used to communicate with the remote peer
     */
    remoteAddr: Multiaddr;
    /**
     * Holds the relevant events timestamps of the connection
     */
    timeline: MultiaddrConnectionTimeline;
}
export declare class WebRTCMultiaddrConnection implements MultiaddrConnection {
    /**
     * WebRTC Peer Connection
     */
    readonly peerConnection: RTCPeerConnection;
    /**
     * The multiaddr address used to communicate with the remote peer
     */
    remoteAddr: Multiaddr;
    /**
     * Holds the lifecycle times of the connection
     */
    timeline: MultiaddrConnectionTimeline;
    /**
     * The stream source, a no-op as the transport natively supports multiplexing
     */
    source: Source<Uint8Array>;
    /**
     * The stream destination, a no-op as the transport natively supports multiplexing
     */
    sink: Sink<Uint8Array, Promise<void>>;
    constructor(init: WebRTCMultiaddrConnectionInit);
    close(err?: Error | undefined): Promise<void>;
}
export {};
//# sourceMappingURL=maconn.d.ts.map