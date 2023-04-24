import React from "react";
import ReactDOM from "react-dom";

import "tachyons";
import "ipfs-css";
// import RtcDemo from "./components/rtcDemo/rtcDemo";
import "./index.css";
import App from "./App.js";
// import { generatePeerMapFromAliases, peerMap } from "./peerMap";
// async function generatePeerMap() {
//   await generatePeerMapFromAliases(1);
// }
// generatePeerMap();

// enable debug og libp2p
localStorage.setItem("debug", "libp2p:*");

ReactDOM.render(
  <div>
    <App />
    {/* <RtcDemo clientId={"client1"} /> */}
  </div>,
  document.getElementById("root")
);
