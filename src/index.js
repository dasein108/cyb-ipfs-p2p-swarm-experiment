import React from "react";
import ReactDOM from "react-dom";

import "tachyons";
import "ipfs-css";
import { myPeers } from "./myPeers.js";
import IpfsNode from "./ipfsNode.js";
// import RtcDemo from "./components/rtcDemo/rtcDemo";
import "./index.css";
import CircuitRelayTest from "./CircuitRelayTest.js";

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
    <CircuitRelayTest />
    <div className="grid">
      {/* {myPeers.map((name) => (
        <IpfsNode nodeId={name} />
      ))} */}
    </div>
    {/* <RtcDemo clientId={"client1"} /> */}
  </div>,
  // </React.StrictMode>,
  document.getElementById("root")
);
