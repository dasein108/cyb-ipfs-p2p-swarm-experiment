import type { DeferredPromise } from 'p-defer';
import * as pb from './pb/index.js';
interface MessageStream {
    read: () => Promise<pb.Message>;
    write: (d: pb.Message) => void | Promise<void>;
}
export declare const readCandidatesUntilConnected: (connectedPromise: DeferredPromise<void>, pc: RTCPeerConnection, stream: MessageStream) => Promise<void>;
export declare function resolveOnConnected(pc: RTCPeerConnection, promise: DeferredPromise<void>): void;
export {};
//# sourceMappingURL=util.d.ts.map