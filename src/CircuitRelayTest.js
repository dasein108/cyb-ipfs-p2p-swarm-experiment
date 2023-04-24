import { useState, useEffect, useRef } from "react";
import { multiaddr, protocols } from "@multiformats/multiaddr";
import { pushable } from "it-pushable";
import { pipe } from "it-pipe";
import { fromString, toString } from "uint8arrays";
import { createNodeLibp2p, nodeLibp2pFactory } from "./createNodeLibp2p";

// import EditWithAction from "./component/EditWithAction";
import EditWithAction from "./components/EditWithAction";
import { ListView } from "./components/ListView";
import { Title } from "./components/Title";

const CIRCUIT_RELAY_CODE = 290;
const WEBRTC_CODE = 281;
const RELAY_ADDR =
  // "/ip4/128.140.86.188/tcp/4441/ws/p2p/12D3KooWHWZbPWceAaHyXmdrvgL6sqjzHy5nH4su7A18XYDTn3Jr";
  "/dns4/daseincore.tech/tcp/4444/wss/p2p/12D3KooWHWZbPWceAaHyXmdrvgL6sqjzHy5nH4su7A18XYDTn3Jr";
const isWebrtc = (ma) => {
  return ma.protoCodes().includes(WEBRTC_CODE);
};

function CircuitRelayTest({ nodeId = "libp2p" }) {
  const node = useRef();
  const sender = useRef(pushable());
  // const intervalRef = useRef(null);

  const [id, setId] = useState(null);
  const [webrtcDirectAddress, setWebrtcDirectAddress] = useState("");

  const [connections, setConnections] = useState([]);
  const [log, setLog] = useState([]);
  const appendLog = (msg) => setLog((log) => [...log, msg]);
  const sendMessage = async (message) => {
    appendLog(`Sending message '${message}'`);
    sender.current.push(fromString(message));
  };

  const connectRelay = async (recipient) => {
    try {
      const ma = multiaddr(recipient);
      appendLog(`Dialing '${ma}'`);
      const connection = await node.current.dial(ma);
      console.log("Connect relay done", connection, isWebrtc(ma));

      if (!isWebrtc(ma)) {
        return;
      }

      const outgoingStream = await connection.newStream(["/echo/1.0.0"]);

      pipe(sender.current, outgoingStream, async (src) => {
        for await (const buf of src) {
          const response = toString(buf.subarray());
          appendLog(`Received message '${response}'`);
        }
      });
    } catch (e) {
      console.log("error connectRelay", e);
    }
  };

  useEffect(() => {
    async function startNode() {
      try {
        node.current = await nodeLibp2pFactory(); // await createNodeLibp2p();
        window[nodeId] = node.current;

        const id = node.current.peerId.toString();
        setId(id);

        console.log("Libp2p Started", id);
        window[nodeId] = node.current;

        function updateConnList() {
          // Update connections list
          const connList = node.current.getConnections().map((connection) => {
            try {
              return connection.remoteAddr.toString();
            } catch (e) {
              console.log("error updateConnList", e, connection);
              return [];
            }
          });
          console.log("--> Connections:", connList);
          setConnections(connList);
        }

        node.current.addEventListener("peer:connect", (event) => {
          updateConnList();
        });
        node.current.addEventListener("peer:disconnect", (event) => {
          updateConnList();
        });

        node.current.peerStore.addEventListener(
          "change:multiaddrs",
          (event) => {
            const { peerId } = event.detail;
            console.log(
              "------change multiaddr",
              event,
              node.current.getMultiaddrs()
            );
            if (
              node.current.getMultiaddrs().length === 0 ||
              !node.current.peerId.equals(peerId)
            ) {
              return;
            }

            node.current.getMultiaddrs().forEach((ma) => {
              if (ma.protoCodes().includes(CIRCUIT_RELAY_CODE)) {
                if (ma.protos().pop()?.name === "p2p") {
                  ma = ma.decapsulateCode(protocols("p2p").code);
                }
                console.log(
                  "---change multiaddr",
                  ma.toString(),
                  node.current.peerId.toString()
                );
                const newWebrtcDirectAddress = multiaddr(
                  ma.toString() + "/webrtc/p2p/" + node.current.peerId
                );

                const newWebrtcAddrString = newWebrtcDirectAddress.toString();

                // only update if the address is new
                if (newWebrtcAddrString !== webrtcDirectAddress) {
                  appendLog(`Listening on '${newWebrtcAddrString}'`);
                  setWebrtcDirectAddress(newWebrtcAddrString);
                }
              }
            });
          }
        );
        await node.current.handle("/echo/1.0.0", ({ stream }) => {
          console.log("incoming stream");
          pipe(
            stream,
            async function* (source) {
              for await (const buf of source) {
                console.log("----> incoming stream", source);

                const incoming = toString(buf.subarray());
                appendLog(`Incomming: ${incoming}`);
                yield buf;
              }
            },
            stream
          );
        });
        await connectRelay(RELAY_ADDR);
      } catch (error) {
        console.error("Node init error:", error);
      }
      // }
    }

    startNode();
  }, []);

  return (
    <div className="sans-serif">
      <main>
        <section className="bg-snow mh1 mt1 pa1">
          <h1 className="f5 fw4 ma0 pv3 aqua montserrat" data-test="title">
            {nodeId}
          </h1>

          <Title>{`ID: ${id}`}</Title>
          <div>
            <span>Addr: </span>
            <span>{webrtcDirectAddress}</span>
            <button
              href="#"
              onClick={() => navigator.clipboard.writeText(webrtcDirectAddress)}
            >
              Copy
            </button>
          </div>
          <div>
            <EditWithAction
              title="Recipient"
              buttonTitle={"Connect"}
              callback={connectRelay}
            />
            <EditWithAction
              title="Message"
              buttonTitle={"SEND"}
              callback={sendMessage}
            />

            <ListView nodeId={nodeId} title="Logs" items={log} />
            <ListView nodeId={nodeId} title="Connections" items={connections} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default CircuitRelayTest;
