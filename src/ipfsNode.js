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

function IpfsNode({ nodeId }) {
  const ipfs = useRef();
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));

  const [id, setId] = useState(null);
  const [content, setContent] = useState("");
  const [cid, setCid] = useState("");
  const [peers, setPeers] = useState([]);
  const [log, setLog] = useState([]);

  const addContent = async () => {
    const result = await addIpfsContent(ipfs.current, content);
    setContent("");

    setLog((log) => [...log, `${content}=>${result.cid}`]);
  };

  const getContent = async () => {
    const result = await getIpfsContent(ipfs.current, cid);
    setCid("");
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

        const id = await ipfs.current.id();
        setPeerMap(nodeId, id.id.toString());

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
  }, [nodeId]);

  return (
    <div className="sans-serif">
      <main>
        {/* {ipfsInitError && (
          <div className='bg-red pa3 mw7 center mv3 white'>
            Error: {ipfsInitError.message || ipfsInitError}
          </div>
        )} */}

        <section className="bg-snow mw7 mh1 mt1 pa1">
          <h1 className="f5 fw4 ma0 pv3 aqua montserrat" data-test="title">
            {`${nodeId}: ${isIpfsReady ? "Ready" : "-"}`}
          </h1>
          <div className="pa2">{id && <IpfsId obj={id} keys={["id"]} />}</div>
          <div>
            <Title>Conent</Title>
            <div className="measure">
              <label className="f6 b db mb2">Text</label>
              <div className="button-wrap">
                <input
                  className="input-reset ba b--black-20 pa2 mb2 db w-70"
                  type="text"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
                <button className="action" onClick={addContent}>
                  {"->Ipfs"}
                </button>
              </div>
            </div>
            <div className="measure">
              <label className="f6 b db mb2">CID</label>
              <div className="button-wrap">
                <input
                  className="input-reset ba b--black-20 pa2 mb2 db w-70"
                  type="text"
                  value={cid}
                  onChange={(event) => setCid(event.target.value)}
                />
                <button className="action" onClick={getContent}>
                  {"get content"}
                </button>
              </div>
            </div>
            <Title>Logs</Title>
            <div className="bg-white f7 pa1 br2 truncate monospace">
              {log.map((c, i) => (
                <div className="f7 pa0" key={`${nodeId}-log-${i}`}>
                  {c}
                </div>
              ))}
            </div>
            <Title>Peers</Title>
            <div className="bg-white f7 pa1 br2 truncate monospace">
              {peers.map((p, i) => (
                <div className="f7 pa0" key={`${nodeId}-${p}-${i}`}>
                  {getPeerAlias(p)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

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
