import React from "react";
import ReactDOM from "react-dom";

import "tachyons";
import "ipfs-css";
import { myPeers } from "./myPeers";
import IpfsNode from "./ipfsNode";
import RtcDemo from "./rtcDemo";
import "./index.css";

// import { generatePeerMapFromAliases } from "./peerMap";

// async function generatePeerMap() {
//   await generatePeerMapFromAliases(3);
// }
// generatePeerMap();

// enable debug og libp2p
localStorage.setItem("debug", "libp2p:*");

ReactDOM.render(
  // <React.StrictMode>
  <div>
    {/* <div className="grid">
      {myPeers.map((name) => (
        <IpfsNode nodeId={name} />
      ))}
    </div> */}
    <RtcDemo clientId={"client1"} />
  </div>,
  // </React.StrictMode>,
  document.getElementById("root")
);
