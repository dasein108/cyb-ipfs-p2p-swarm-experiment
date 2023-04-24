import { symbol } from '@libp2p/interface-transport';
import { multiaddr, protocols } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { WebRTCMultiaddrConnection } from '../maconn.js';
import { WebRTCPeerListener } from './listener.js';
import { logger } from '@libp2p/logger';
import { initiateConnection, handleIncomingStream } from './handler.js';
import { CodeError } from '@libp2p/interfaces/errors';
import { codes } from '../error.js';
const log = logger('libp2p:webrtc:peer');
export const TRANSPORT = '/webrtc';
export const SIGNALING_PROTO_ID = '/webrtc-signaling/0.0.1';
export const CODE = protocols('webrtc').code;
export class WebRTCTransport {
    constructor(components, init) {
        this.components = components;
        this.init = init;
        this._started = false;
    }
    isStarted() {
        return this._started;
    }
    async start() {
        await this.components.registrar.handle(SIGNALING_PROTO_ID, (data) => {
            this._onProtocol(data).catch(err => { log.error('failed to handle incoming connect from %p', data.connection.remotePeer, err); });
        });
        this._started = true;
    }
    async stop() {
        await this.components.registrar.unhandle(SIGNALING_PROTO_ID);
        this._started = false;
    }
    createListener(options) {
        return new WebRTCPeerListener(this.components);
    }
    get [Symbol.toStringTag]() {
        return '@libp2p/webrtc';
    }
    get [symbol]() {
        return true;
    }
    filter(multiaddrs) {
        return multiaddrs.filter((ma) => {
            const codes = ma.protoCodes();
            return codes.includes(CODE);
        });
    }
    splitAddr(ma) {
        const addrs = ma.toString().split(`${TRANSPORT}/`);
        if (addrs.length !== 2) {
            throw new CodeError('invalid multiaddr', codes.ERR_INVALID_MULTIADDR);
        }
        // look for remote peerId
        let remoteAddr = multiaddr(addrs[0]);
        const destination = multiaddr('/' + addrs[1]);
        const destinationIdString = destination.getPeerId();
        if (destinationIdString == null) {
            throw new CodeError('bad destination', codes.ERR_INVALID_MULTIADDR);
        }
        const lastProtoInRemote = remoteAddr.protos().pop();
        if (lastProtoInRemote === undefined) {
            throw new CodeError('invalid multiaddr', codes.ERR_INVALID_MULTIADDR);
        }
        if (lastProtoInRemote.name !== 'p2p') {
            remoteAddr = remoteAddr.encapsulate(`/p2p/${destinationIdString}`);
        }
        return { baseAddr: remoteAddr, peerId: peerIdFromString(destinationIdString) };
    }
    /*
     * dial connects to a remote via the circuit relay or any other protocol
     * and proceeds to upgrade to a webrtc connection.
     * multiaddr of the form: <multiaddr>/webrtc/p2p/<destination-peer>
     * For a circuit relay, this will be of the form
     * <relay address>/p2p/<relay-peer>/p2p-circuit/webrtc/p2p/<destination-peer>
    */
    async dial(ma, options) {
        log.trace('dialing address: ', ma);
        const { baseAddr, peerId } = this.splitAddr(ma);
        if (options.signal == null) {
            const controller = new AbortController();
            options.signal = controller.signal;
        }
        const connection = await this.components.transportManager.dial(baseAddr);
        const rawStream = await connection.newStream([SIGNALING_PROTO_ID], options);
        try {
            const [pc, muxerFactory] = await initiateConnection({
                stream: rawStream,
                rtcConfiguration: this.init.rtcConfiguration,
                signal: options.signal
            });
            const webrtcMultiaddr = baseAddr.encapsulate(`${TRANSPORT}/p2p/${peerId.toString()}`);
            const result = await options.upgrader.upgradeOutbound(new WebRTCMultiaddrConnection({
                peerConnection: pc,
                timeline: { open: (new Date()).getTime() },
                remoteAddr: webrtcMultiaddr
            }), {
                skipProtection: true,
                skipEncryption: true,
                muxerFactory
            });
            // close the stream if SDP has been exchanged successfully
            rawStream.close();
            return result;
        }
        catch (err) {
            // reset the stream in case of any error
            rawStream.reset();
            throw err;
        }
    }
    async _onProtocol({ connection, stream }) {
        try {
            const [pc, muxerFactory] = await handleIncomingStream({
                rtcConfiguration: this.init.rtcConfiguration,
                connection,
                stream
            });
            const remotePeerId = connection.remoteAddr.getPeerId();
            const webrtcMultiaddr = connection.remoteAddr.encapsulate(`${TRANSPORT}/p2p/${remotePeerId}`);
            await this.components.upgrader.upgradeInbound(new WebRTCMultiaddrConnection({
                peerConnection: pc,
                timeline: { open: (new Date()).getTime() },
                remoteAddr: webrtcMultiaddr
            }), {
                skipEncryption: true,
                skipProtection: true,
                muxerFactory
            });
        }
        catch (err) {
            stream.reset();
            throw err;
        }
    }
}
//# sourceMappingURL=transport.js.map