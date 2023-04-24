import { logger } from '@libp2p/logger';
import * as lengthPrefixed from 'it-length-prefixed';
import merge from 'it-merge';
import { pipe } from 'it-pipe';
import { pushable } from 'it-pushable';
import defer from 'p-defer';
import { Uint8ArrayList } from 'uint8arraylist';
import * as pb from '../proto_ts/message.js';
const log = logger('libp2p:webrtc:stream');
/**
 * Constructs a default StreamStat
 */
export function defaultStat(dir) {
    return {
        direction: dir,
        timeline: {
            open: 0,
            close: undefined
        }
    };
}
export var StreamStates;
(function (StreamStates) {
    StreamStates[StreamStates["OPEN"] = 0] = "OPEN";
    StreamStates[StreamStates["READ_CLOSED"] = 1] = "READ_CLOSED";
    StreamStates[StreamStates["WRITE_CLOSED"] = 2] = "WRITE_CLOSED";
    StreamStates[StreamStates["CLOSED"] = 3] = "CLOSED";
})(StreamStates || (StreamStates = {}));
// Checked by the Typescript compiler. If this fails it's because the switch
// statement is not exhaustive.
function unreachableBranch(x) {
    throw new Error('Case not handled in switch');
}
class StreamState {
    constructor() {
        this.state = StreamStates.OPEN;
    }
    isWriteClosed() {
        return (this.state === StreamStates.CLOSED || this.state === StreamStates.WRITE_CLOSED);
    }
    transition({ direction, flag }) {
        const prev = this.state;
        // return early if the stream is closed
        if (this.state === StreamStates.CLOSED) {
            return [prev, StreamStates.CLOSED];
        }
        if (direction === 'inbound') {
            switch (flag) {
                case pb.Message_Flag.FIN:
                    if (this.state === StreamStates.OPEN) {
                        this.state = StreamStates.READ_CLOSED;
                    }
                    else if (this.state === StreamStates.WRITE_CLOSED) {
                        this.state = StreamStates.CLOSED;
                    }
                    break;
                case pb.Message_Flag.STOP_SENDING:
                    if (this.state === StreamStates.OPEN) {
                        this.state = StreamStates.WRITE_CLOSED;
                    }
                    else if (this.state === StreamStates.READ_CLOSED) {
                        this.state = StreamStates.CLOSED;
                    }
                    break;
                case pb.Message_Flag.RESET:
                    this.state = StreamStates.CLOSED;
                    break;
                default:
                    unreachableBranch(flag);
            }
        }
        else {
            switch (flag) {
                case pb.Message_Flag.FIN:
                    if (this.state === StreamStates.OPEN) {
                        this.state = StreamStates.WRITE_CLOSED;
                    }
                    else if (this.state === StreamStates.READ_CLOSED) {
                        this.state = StreamStates.CLOSED;
                    }
                    break;
                case pb.Message_Flag.STOP_SENDING:
                    if (this.state === StreamStates.OPEN) {
                        this.state = StreamStates.READ_CLOSED;
                    }
                    else if (this.state === StreamStates.WRITE_CLOSED) {
                        this.state = StreamStates.CLOSED;
                    }
                    break;
                case pb.Message_Flag.RESET:
                    this.state = StreamStates.CLOSED;
                    break;
                default:
                    unreachableBranch(flag);
            }
        }
        return [prev, this.state];
    }
}
export class WebRTCStream {
    constructor(opts) {
        /**
         * The current state of the stream
         */
        this.streamState = new StreamState();
        /**
         * push data from the underlying datachannel to the length prefix decoder
         * and then the protobuf decoder.
         */
        this._innersrc = pushable();
        /**
         * Deferred promise that resolves when the underlying datachannel is in the
         * open state.
         */
        this.opened = defer();
        /**
         * sinkCreated is set to true once the sinkFunction is invoked
         */
        this._sinkCalled = false;
        /**
         * Triggers a generator which can be used to close the sink.
         */
        this.closeWritePromise = defer();
        this.channel = opts.channel;
        this.id = this.channel.label;
        this.stat = opts.stat;
        switch (this.channel.readyState) {
            case 'open':
                this.opened.resolve();
                break;
            case 'closed':
            case 'closing':
                this.streamState.state = StreamStates.CLOSED;
                if (this.stat.timeline.close === undefined || this.stat.timeline.close === 0) {
                    this.stat.timeline.close = new Date().getTime();
                }
                this.opened.resolve();
                break;
            case 'connecting':
                // noop
                break;
            default:
                unreachableBranch(this.channel.readyState);
        }
        this.metadata = opts.metadata ?? {};
        // handle RTCDataChannel events
        this.channel.onopen = (_evt) => {
            this.stat.timeline.open = new Date().getTime();
            this.opened.resolve();
        };
        this.channel.onclose = (_evt) => {
            this.close();
        };
        this.channel.onerror = (evt) => {
            const err = evt.error;
            this.abort(err);
        };
        const self = this;
        // reader pipe
        this.channel.onmessage = async ({ data }) => {
            if (data === null || data.length === 0) {
                return;
            }
            this._innersrc.push(new Uint8Array(data));
        };
        // pipe framed protobuf messages through a length prefixed decoder, and
        // surface data from the `Message.message` field through a source.
        this._src = pipe(this._innersrc, lengthPrefixed.decode(), (source) => (async function* () {
            for await (const buf of source) {
                const message = self.processIncomingProtobuf(buf.subarray());
                if (message != null) {
                    yield new Uint8ArrayList(message);
                }
            }
        })());
    }
    // If user attempts to set a new source this should be a noop
    set source(_src) { }
    get source() {
        return this._src;
    }
    /**
     * Write data to the remote peer.
     * It takes care of wrapping data in a protobuf and adding the length prefix.
     */
    async sink(src) {
        if (this._sinkCalled) {
            throw new Error('sink already called on this stream');
        }
        // await stream opening before sending data
        await this.opened.promise;
        try {
            await this._sink(src);
        }
        finally {
            this.closeWrite();
        }
    }
    /**
     * Closable sink implementation
     */
    async _sink(src) {
        const closeWrite = this._closeWriteIterable();
        for await (const buf of merge(closeWrite, src)) {
            if (this.streamState.isWriteClosed()) {
                return;
            }
            const msgbuf = pb.Message.toBinary({ message: buf.subarray() });
            const sendbuf = lengthPrefixed.encode.single(msgbuf);
            this.channel.send(sendbuf.subarray());
        }
    }
    /**
     * Handle incoming
     */
    processIncomingProtobuf(buffer) {
        const message = pb.Message.fromBinary(buffer);
        if (message.flag !== undefined) {
            const [currentState, nextState] = this.streamState.transition({ direction: 'inbound', flag: message.flag });
            if (currentState !== nextState) {
                switch (nextState) {
                    case StreamStates.READ_CLOSED:
                        this._innersrc.end();
                        break;
                    case StreamStates.WRITE_CLOSED:
                        this.closeWritePromise.resolve();
                        break;
                    case StreamStates.CLOSED:
                        this.close();
                        break;
                    // StreamStates.OPEN will never be a nextState
                    case StreamStates.OPEN:
                        break;
                    default:
                        unreachableBranch(nextState);
                }
            }
        }
        return message.message;
    }
    /**
     * Close a stream for reading and writing
     */
    close() {
        this.stat.timeline.close = new Date().getTime();
        this.streamState.state = StreamStates.CLOSED;
        this._innersrc.end();
        this.closeWritePromise.resolve();
        this.channel.close();
        if (this.closeCb !== undefined) {
            this.closeCb(this);
        }
    }
    /**
     * Close a stream for reading only
     */
    closeRead() {
        const [currentState, nextState] = this.streamState.transition({ direction: 'outbound', flag: pb.Message_Flag.STOP_SENDING });
        if (currentState === nextState) {
            // No change, no op
            return;
        }
        if (currentState === StreamStates.OPEN || currentState === StreamStates.WRITE_CLOSED) {
            this._sendFlag(pb.Message_Flag.STOP_SENDING);
            this._innersrc.end();
        }
        if (nextState === StreamStates.CLOSED) {
            this.close();
        }
    }
    /**
     * Close a stream for writing only
     */
    closeWrite() {
        const [currentState, nextState] = this.streamState.transition({ direction: 'outbound', flag: pb.Message_Flag.FIN });
        if (currentState === nextState) {
            // No change, no op
            return;
        }
        if (currentState === StreamStates.OPEN || currentState === StreamStates.READ_CLOSED) {
            this._sendFlag(pb.Message_Flag.FIN);
            this.closeWritePromise.resolve();
        }
        if (nextState === StreamStates.CLOSED) {
            this.close();
        }
    }
    /**
     * Call when a local error occurs, should close the stream for reading and writing
     */
    abort(err) {
        log.error(`An error occurred, closing the stream for reading and writing: ${err.message}`);
        this.close();
    }
    /**
     * Close the stream for writing, and indicate to the remote side this is being done 'abruptly'
     *
     * @see this.closeWrite
     */
    reset() {
        const [currentState, nextState] = this.streamState.transition({ direction: 'outbound', flag: pb.Message_Flag.RESET });
        if (currentState === nextState) {
            // No change, no op
            return;
        }
        this._sendFlag(pb.Message_Flag.RESET);
        this.close();
    }
    _sendFlag(flag) {
        try {
            log.trace('Sending flag: %s', flag.toString());
            const msgbuf = pb.Message.toBinary({ flag });
            this.channel.send(lengthPrefixed.encode.single(msgbuf).subarray());
        }
        catch (err) {
            if (err instanceof Error) {
                log.error(`Exception while sending flag ${flag}: ${err.message}`);
            }
        }
    }
    _closeWriteIterable() {
        const self = this;
        return {
            async *[Symbol.asyncIterator]() {
                await self.closeWritePromise.promise;
                yield new Uint8Array(0);
            }
        };
    }
    eq(stream) {
        if (stream instanceof WebRTCStream) {
            return stream.channel.id === this.channel.id;
        }
        return false;
    }
}
//# sourceMappingURL=stream.js.map