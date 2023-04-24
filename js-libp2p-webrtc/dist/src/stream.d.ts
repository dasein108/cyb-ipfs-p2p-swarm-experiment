import type { Stream, StreamStat, Direction } from '@libp2p/interface-connection';
import { DeferredPromise } from 'p-defer';
import type { Source } from 'it-stream-types';
import { Uint8ArrayList } from 'uint8arraylist';
import * as pb from '../proto_ts/message.js';
/**
 * Constructs a default StreamStat
 */
export declare function defaultStat(dir: Direction): StreamStat;
interface StreamInitOpts {
    /**
     * The network channel used for bidirectional peer-to-peer transfers of
     * arbitrary data
     *
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel}
     */
    channel: RTCDataChannel;
    /**
     * User defined stream metadata
     */
    metadata?: Record<string, any>;
    /**
     * Stats about this stream
     */
    stat: StreamStat;
    /**
     * Callback to invoke when the stream is closed.
     */
    closeCb?: (stream: WebRTCStream) => void;
}
interface StreamStateInput {
    /**
     * Outbound conections are opened by the local node, inbound streams are
     * opened by the remote
     */
    direction: 'inbound' | 'outbound';
    /**
     * Message flag from the protobufs
     *
     * 0 = FIN
     * 1 = STOP_SENDING
     * 2 = RESET
     */
    flag: pb.Message_Flag;
}
export declare enum StreamStates {
    OPEN = 0,
    READ_CLOSED = 1,
    WRITE_CLOSED = 2,
    CLOSED = 3
}
declare class StreamState {
    state: StreamStates;
    isWriteClosed(): boolean;
    transition({ direction, flag }: StreamStateInput): [StreamStates, StreamStates];
}
export declare class WebRTCStream implements Stream {
    /**
     * Unique identifier for a stream
     */
    id: string;
    /**
     * Stats about this stream
     */
    stat: StreamStat;
    /**
     * User defined stream metadata
     */
    metadata: Record<string, any>;
    /**
     * The data channel used to send and receive data
     */
    private readonly channel;
    /**
     * The current state of the stream
     */
    streamState: StreamState;
    /**
     * Read unwrapped protobuf data from the underlying datachannel.
     * _src is exposed to the user via the `source` getter to .
     */
    private readonly _src;
    /**
     * push data from the underlying datachannel to the length prefix decoder
     * and then the protobuf decoder.
     */
    private readonly _innersrc;
    /**
     * Deferred promise that resolves when the underlying datachannel is in the
     * open state.
     */
    opened: DeferredPromise<void>;
    /**
     * sinkCreated is set to true once the sinkFunction is invoked
     */
    _sinkCalled: boolean;
    /**
     * Triggers a generator which can be used to close the sink.
     */
    closeWritePromise: DeferredPromise<void>;
    /**
     * Callback to invoke when the stream is closed.
     */
    closeCb?: (stream: WebRTCStream) => void;
    constructor(opts: StreamInitOpts);
    set source(_src: Source<Uint8ArrayList>);
    get source(): Source<Uint8ArrayList>;
    /**
     * Write data to the remote peer.
     * It takes care of wrapping data in a protobuf and adding the length prefix.
     */
    sink(src: Source<Uint8ArrayList | Uint8Array>): Promise<void>;
    /**
     * Closable sink implementation
     */
    private _sink;
    /**
     * Handle incoming
     */
    processIncomingProtobuf(buffer: Uint8Array): Uint8Array | undefined;
    /**
     * Close a stream for reading and writing
     */
    close(): void;
    /**
     * Close a stream for reading only
     */
    closeRead(): void;
    /**
     * Close a stream for writing only
     */
    closeWrite(): void;
    /**
     * Call when a local error occurs, should close the stream for reading and writing
     */
    abort(err: Error): void;
    /**
     * Close the stream for writing, and indicate to the remote side this is being done 'abruptly'
     *
     * @see this.closeWrite
     */
    reset(): void;
    private _sendFlag;
    private _closeWriteIterable;
    eq(stream: Stream): boolean;
}
export {};
//# sourceMappingURL=stream.d.ts.map