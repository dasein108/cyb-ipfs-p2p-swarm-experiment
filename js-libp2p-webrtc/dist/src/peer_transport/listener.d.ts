import type { PeerId } from '@libp2p/interface-peer-id';
import type { ListenerEvents, TransportManager, Upgrader, Listener } from '@libp2p/interface-transport';
import { EventEmitter } from '@libp2p/interfaces/events';
import { Multiaddr } from '@multiformats/multiaddr';
export interface ListenerOptions {
    peerId: PeerId;
    upgrader: Upgrader;
    transportManager: TransportManager;
}
export declare class WebRTCPeerListener extends EventEmitter<ListenerEvents> implements Listener {
    private readonly opts;
    constructor(opts: ListenerOptions);
    private getBaseAddress;
    private listeningAddrs;
    listen(ma: Multiaddr): Promise<void>;
    getAddrs(): Multiaddr[];
    close(): Promise<void>;
}
//# sourceMappingURL=listener.d.ts.map