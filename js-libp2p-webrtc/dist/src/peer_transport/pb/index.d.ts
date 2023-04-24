import type { Uint8ArrayList } from 'uint8arraylist';
import type { Codec } from 'protons-runtime';
export interface Message {
    type?: Message.Type;
    data?: string;
}
export declare namespace Message {
    enum Type {
        SDP_OFFER = "SDP_OFFER",
        SDP_ANSWER = "SDP_ANSWER",
        ICE_CANDIDATE = "ICE_CANDIDATE"
    }
    namespace Type {
        const codec: () => Codec<Type>;
    }
    const codec: () => Codec<Message>;
    const encode: (obj: Message) => Uint8Array;
    const decode: (buf: Uint8Array | Uint8ArrayList) => Message;
}
//# sourceMappingURL=index.d.ts.map