import type { Transport } from '@libp2p/interface-transport';
import type { WebRTCTransportComponents, WebRTCTransportInit } from './peer_transport/transport.js';
import { WebRTCDirectTransportComponents } from './transport.js';
declare function webRTCDirect(): (components: WebRTCDirectTransportComponents) => Transport;
declare function webRTC(init?: WebRTCTransportInit): (components: WebRTCTransportComponents) => Transport;
export { webRTC, webRTCDirect };
//# sourceMappingURL=index.d.ts.map