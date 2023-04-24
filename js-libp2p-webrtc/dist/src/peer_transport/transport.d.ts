import type { Connection } from '@libp2p/interface-connection';
import { CreateListenerOptions, DialOptions, Listener, symbol, Transport } from '@libp2p/interface-transport';
import type { TransportManager, Upgrader } from '@libp2p/interface-transport';
import { Multiaddr } from '@multiformats/multiaddr';
import type { IncomingStreamData, Registrar } from '@libp2p/interface-registrar';
import type { PeerId } from '@libp2p/interface-peer-id';
import type { Startable } from '@libp2p/interfaces/startable';
import type { PeerStore } from '@libp2p/interface-peer-store';
export declare const TRANSPORT = "/webrtc";
export declare const SIGNALING_PROTO_ID = "/webrtc-signaling/0.0.1";
export declare const CODE: number;
export interface WebRTCTransportInit {
    rtcConfiguration?: RTCConfiguration;
}
export interface WebRTCTransportComponents {
    peerId: PeerId;
    registrar: Registrar;
    upgrader: Upgrader;
    transportManager: TransportManager;
    peerStore: PeerStore;
}
export declare class WebRTCTransport implements Transport, Startable {
    private readonly components;
    private readonly init;
    private _started;
    constructor(components: WebRTCTransportComponents, init: WebRTCTransportInit);
    isStarted(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    createListener(options: CreateListenerOptions): Listener;
    get [Symbol.toStringTag](): string;
    get [symbol](): true;
    filter(multiaddrs: Multiaddr[]): Multiaddr[];
    private splitAddr;
    dial(ma: Multiaddr, options: DialOptions): Promise<Connection>;
    _onProtocol({ connection, stream }: IncomingStreamData): Promise<void>;
}
//# sourceMappingURL=transport.d.ts.map