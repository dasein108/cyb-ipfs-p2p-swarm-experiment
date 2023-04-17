import React from "react";
import ReactDOM from "react-dom";

import "tachyons";
import "ipfs-css";
import { myPeers } from "./myPeers";
import IpfsNode from "./ipfsNode";

import "./index.css";

// import { generatePeerMapFromAliases } from "./peerMap";

// async function generatePeerMap() {
//   await generatePeerMapFromAliases(3);
// }
// generatePeerMap();

ReactDOM.render(
  <React.StrictMode>
    <div className="grid">
      {myPeers.map((name) => (
        <IpfsNode nodeId={name} />
      ))}
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
