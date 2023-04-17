import React from "react";
import ReactDOM from "react-dom";

import "tachyons";
import "ipfs-css";
// import { myPeers } from "./myPeers";
// import IpfsNode from "./ipfsNode";
import IpfsNode from "./ipfsNode_.js";

import "./index.css";

// import { generatePeerMapFromAliases } from "./peerMap";

// async function generatePeerMap() {
//   await generatePeerMapFromAliases(3);
// }
// generatePeerMap();
let workerPort = null;
const main = async () => {
  // connect / spawn shared ipfs worker & create a client.
  const worker = new SharedWorker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });
  workerPort = worker.port;
  // const ipfs = IPFSClient.from(worker.port)
};

main();
ReactDOM.render(
  <React.StrictMode>
    <div className="grid">
      {/* {myPeers.map((name) => ( */}
      <IpfsNode nodeId={"Neuron.0"} workerPort={workerPort} />
      {/* ))} */}
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
