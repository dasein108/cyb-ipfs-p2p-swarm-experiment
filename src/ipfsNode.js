import { useState, useEffect, useRef } from "react";
import { create } from "ipfs-core";
import { toString as uint8ArrayToAsciiString } from "uint8arrays/to-string";
import { concat as uint8ArrayConcat } from "uint8arrays/concat";

import configIpfs from "./configIpfs";

import { getPeerAlias, setPeerMap } from "./peerMap";
import { connectToSwarm } from "./utils";

const CYBERNODE_SWARM_ADDR =
  "/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB";

const timeStart = Date.now();
const ellapsedTime = () => (Date.now() - timeStart) / 1000;

const addIpfsContent = async (ipfs, text) => {
  const entry = await ipfs.add(new Blob([text], { type: "text/plain" }));
  return entry;
};

const getIpfsContent = async (ipfs, cid) => {
  const chunks = [];
  for await (const chunk of ipfs.cat(cid)) {
    console.info(chunk);
    chunks.push(chunk);
  }
  console.log("got content: ", cid, chunks);

  return uint8ArrayToAsciiString(uint8ArrayConcat(chunks));
};

const PUB_SUB_TOPIC = "cyber";

const subscribePubSub = async (ipfs, callback) => {
  const receiveMsg = (msg) => {
    console.log("received msg: ", msg);
    callback(new TextDecoder().decode(msg.data));
  };
  // console.log(new TextDecoder().decode(msg.data));

  await ipfs.pubsub.subscribe(PUB_SUB_TOPIC, receiveMsg);
  console.log(`subscribed to ${PUB_SUB_TOPIC}`);
};

const publishPubSub = async (ipfs, msg) => {
  const message = new TextEncoder().encode(msg);
  await ipfs.pubsub.publish(PUB_SUB_TOPIC, message);
};

function IpfsNode({ nodeId }) {
  const ipfs = useRef();
  const intervalRef = useRef(null);

  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [id, setId] = useState(null);
  const [peers, setPeers] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [swarmPeers, setSwarmPeers] = useState([]);
  const [log, setLog] = useState([]);

  const addContent = async (content) => {
    const result = await addIpfsContent(ipfs.current, content);

    setLog((log) => [...log, `${content}=>${result.cid}`]);
  };

  const addPubSub = async (msg) => {
    const result = await publishPubSub(ipfs.current, msg);
    setMsgs((log) => [...log, `${msg}`]);
  };

  const getContent = async (cid) => {
    const result = await getIpfsContent(ipfs.current, cid);
    setLog((log) => [...log, `${cid}=>${result}`]);
  };

  useEffect(() => {
    async function startIpfs() {
      try {
        // console.time("IPFS Started");
        // const peerId = getPeerIdByAlias(nodeId);

        // if (!peerId) {
        //   console.log(`Map RANDOM peer ${peerId} to ${nodeId}`);
        // }

        ipfs.current = await create(configIpfs(nodeId));
        await connectToSwarm(ipfs.current, CYBERNODE_SWARM_ADDR);
        await subscribePubSub(ipfs.current, (msg) =>
          setMsgs((msgs) => [...msgs, msg])
        );
        // await connectToSwarm(
        //   ipfs.current,
        //   "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star"
        // );
        const id = await ipfs.current.id();
        console.log("IPFS Started", id.id.toString());
        setPeerMap(nodeId, id.id.toString());

        ipfs.current.libp2p.addEventListener("peer:discovery", (evt) => {
          // dial them when we discover them
          ipfs.current.libp2p
            .dial(evt.detail.id)
            .then((res) => {
              console.log(`---Dial is ok ${res.remotePeer.toString()}`, res);
            })
            .catch((err) => {
              console.debug(`Could not dial ${evt.detail.id}`, err);
            });
        });

        ipfs.current.libp2p.addEventListener("peer:connect", (evt) => {
          const peerId = evt.detail.remotePeer.toString();
          setPeers((peers) => [...peers, peerId]);
          console.log(
            `Connected ${nodeId} <-> ${getPeerAlias(peerId)} ${ellapsedTime()}s`
          );
        });

        ipfs.current.libp2p.addEventListener("peer:disconnect", (evt) => {
          const peerId = evt.detail.remotePeer.toString();
          setPeers((peers) => peers.filter((p) => p !== peerId));
          console.log(
            `Disconnected ${nodeId} -x- ${getPeerAlias(
              peerId
            )} ${ellapsedTime()}s`
          );
        });
        setId(id);
      } catch (error) {
        console.error("IPFS init error:", error);
      }
      // }

      setIpfsReady(Boolean(ipfs.current));
    }

    startIpfs();

    intervalRef.current = window.setInterval(() => {
      const resolvePeers = async () => {
        const peers = await ipfs.current.swarm.peers();
        if (peers) setSwarmPeers(peers.map((p) => p.peer.toString()));
      };
      resolvePeers();
    }, 5000);

    return () => window.clearInterval(intervalRef.current);
  }, [nodeId, log]);

  return (
    <div className="sans-serif">
      <main>
        <section className="bg-snow mw7 mh1 mt1 pa1">
          <h1 className="f5 fw4 ma0 pv3 aqua montserrat" data-test="title">
            {`${nodeId}: ${isIpfsReady ? "Ready" : "-"}`}
          </h1>
          <div className="pa2">{id && <IpfsId obj={id} keys={["id"]} />}</div>
          <div>
            <IpfsAction
              title="Content"
              buttonTitle={"->Ipfs"}
              callback={addContent}
            />
            <IpfsAction
              title="CID"
              buttonTitle={"get content"}
              callback={getContent}
            />
            <IpfsAction
              title="PubSub Msg"
              buttonTitle={"send msg"}
              callback={addPubSub}
            />

            <ListView nodeId={nodeId} title="Logs" items={log} />
            <ListView nodeId={nodeId} title="PubSub" items={msgs} />
            <ListView
              nodeId={nodeId}
              title="Peers"
              items={peers}
              mapper={getPeerAlias}
            />
            <ListView
              nodeId={nodeId}
              title="Swarm"
              items={swarmPeers}
              mapper={getPeerAlias}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

const IpfsAction = ({ title, buttonTitle, callback }) => {
  const [content, setContent] = useState("");
  const onClick = async () => {
    callback(content);
    setContent("");
  };
  return (
    <>
      <div className="measure">
        <label className="f6 b db mb2">{title}</label>
        <div className="button-wrap">
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-70"
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <button className="action" onClick={onClick}>
            {buttonTitle}
          </button>
        </div>
      </div>
    </>
  );
};

const ListView = ({ nodeId, items, title, mapper }) => (
  <>
    <Title>{title}</Title>
    <div className="bg-white f7 pa1 br2 truncate monospace">
      {items.map((p, i) => (
        <div className="f7 pa0" key={`${nodeId}-${title}-${i}`}>
          {mapper ? mapper(p) : p}
        </div>
      ))}
    </div>
  </>
);

const Title = ({ children }) => {
  return <h2 className="f7 ma0 pb2 aqua fw4 montserrat">{children}</h2>;
};

const IpfsId = ({ keys, obj }) => {
  if (!obj || !keys || keys.length === 0) return null;
  return (
    <>
      {keys?.map((key) => (
        <div className="mb1" key={key}>
          <Title>{key}</Title>
          <div
            className="bg-white f7 pa1 br2 truncate monospace"
            data-test={key}
          >
            {obj[key].toString()}
          </div>
        </div>
      ))}
    </>
  );
};

export default IpfsNode;
