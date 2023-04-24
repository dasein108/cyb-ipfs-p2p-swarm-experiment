import { logger } from '@libp2p/logger';
import { nopSink, nopSource } from './util.js';
const log = logger('libp2p:webrtc:connection');
export class WebRTCMultiaddrConnection {
    constructor(init) {
        /**
         * The stream source, a no-op as the transport natively supports multiplexing
         */
        this.source = nopSource;
        /**
         * The stream destination, a no-op as the transport natively supports multiplexing
         */
        this.sink = nopSink;
        this.remoteAddr = init.remoteAddr;
        this.timeline = init.timeline;
        this.peerConnection = init.peerConnection;
    }
    async close(err) {
        if (err !== undefined) {
            log.error('error closing connection', err);
        }
        this.timeline.close = new Date().getTime();
        this.peerConnection.close();
    }
}
//# sourceMappingURL=maconn.js.map