import type { Connection } from '@libp2p/interface-connection';
import type { PeerId } from '@libp2p/interface-peer-id';
import { CreateListenerOptions, Listener, symbol, Transport } from '@libp2p/interface-transport';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { WebRTCDialOptions } from './options.js';
/**
 * Created by converting the hexadecimal protocol code to an integer.
 *
 * {@link https://github.com/multiformats/multiaddr/blob/master/protocols.csv}
 */
export declare const WEBRTC_CODE: number;
/**
 * Created by converting the hexadecimal protocol code to an integer.
 *
 * {@link https://github.com/multiformats/multiaddr/blob/master/protocols.csv}
 */
export declare const CERTHASH_CODE: number;
/**
 * The peer for this transport
 */
export interface WebRTCDirectTransportComponents {
    peerId: PeerId;
}
export declare class WebRTCDirectTransport implements Transport {
    /**
     * The peer for this transport
     */
    private readonly components;
    constructor(components: WebRTCDirectTransportComponents);
    /**
     * Dial a given multiaddr
     */
    dial(ma: Multiaddr, options: WebRTCDialOptions): Promise<Connection>;
    /**
     * Create transport listeners no supported by browsers
     */
    createListener(options: CreateListenerOptions): Listener;
    /**
     * Takes a list of `Multiaddr`s and returns only valid addresses for the transport
     */
    filter(multiaddrs: Multiaddr[]): Multiaddr[];
    /**
     * Implement toString() for WebRTCTransport
     */
    get [Symbol.toStringTag](): string;
    /**
     * Symbol.for('@libp2p/transport')
     */
    get [symbol](): true;
    /**
     * Connect to a peer using a multiaddr
     */
    _connect(ma: Multiaddr, options: WebRTCDialOptions): Promise<Connection>;
    /**
     * Generate a noise prologue from the peer connection's certificate.
     * noise prologue = bytes('libp2p-webrtc-noise:') + noise-responder fingerprint + noise-initiator fingerprint
     */
    private generateNoisePrologue;
}
//# sourceMappingURL=transport.d.ts.map