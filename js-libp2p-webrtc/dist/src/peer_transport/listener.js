import { EventEmitter } from '@libp2p/interfaces/events';
import { multiaddr } from '@multiformats/multiaddr';
import { inappropriateMultiaddr } from '../error.js';
import { TRANSPORT } from './transport.js';
export class WebRTCPeerListener extends EventEmitter {
    constructor(opts) {
        super();
        this.opts = opts;
        this.listeningAddrs = [];
    }
    getBaseAddress(ma) {
        const addrs = ma.toString().split(TRANSPORT);
        if (addrs.length < 2) {
            throw inappropriateMultiaddr('base address not found');
        }
        return multiaddr(addrs[0]);
    }
    async listen(ma) {
        const baseAddr = this.getBaseAddress(ma);
        const tpt = this.opts.transportManager.transportForMultiaddr(baseAddr);
        const listener = tpt?.createListener({ ...this.opts });
        await listener?.listen(baseAddr);
        const listeningAddr = ma.encapsulate(`/p2p/${this.opts.peerId.toString()}`);
        this.listeningAddrs.push(listeningAddr);
        listener?.addEventListener('close', () => {
            this.listeningAddrs = this.listeningAddrs.filter(a => a !== listeningAddr);
        });
    }
    getAddrs() { return this.listeningAddrs; }
    async close() { }
}
//# sourceMappingURL=listener.js.map