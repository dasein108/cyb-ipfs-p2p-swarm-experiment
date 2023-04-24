/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { enumeration, encodeMessage, decodeMessage, message } from 'protons-runtime';
export var Message;
(function (Message) {
    let Type;
    (function (Type) {
        Type["SDP_OFFER"] = "SDP_OFFER";
        Type["SDP_ANSWER"] = "SDP_ANSWER";
        Type["ICE_CANDIDATE"] = "ICE_CANDIDATE";
    })(Type = Message.Type || (Message.Type = {}));
    let __TypeValues;
    (function (__TypeValues) {
        __TypeValues[__TypeValues["SDP_OFFER"] = 0] = "SDP_OFFER";
        __TypeValues[__TypeValues["SDP_ANSWER"] = 1] = "SDP_ANSWER";
        __TypeValues[__TypeValues["ICE_CANDIDATE"] = 2] = "ICE_CANDIDATE";
    })(__TypeValues || (__TypeValues = {}));
    (function (Type) {
        Type.codec = () => {
            return enumeration(__TypeValues);
        };
    })(Type = Message.Type || (Message.Type = {}));
    let _codec;
    Message.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if (obj.type != null) {
                    w.uint32(8);
                    Message.Type.codec().encode(obj.type, w);
                }
                if (obj.data != null) {
                    w.uint32(18);
                    w.string(obj.data);
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length) => {
                const obj = {};
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1:
                            obj.type = Message.Type.codec().decode(reader);
                            break;
                        case 2:
                            obj.data = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    Message.encode = (obj) => {
        return encodeMessage(obj, Message.codec());
    };
    Message.decode = (buf) => {
        return decodeMessage(buf, Message.codec());
    };
})(Message || (Message = {}));
//# sourceMappingURL=index.js.map