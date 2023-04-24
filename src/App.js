import { useState } from "react";
import PeerAliasSelector from "./PeerAliasSelector";
import IpfsNode from "./ipfsNode.js";
import CircuitRelayTest from "./CircuitRelayTest.js";

function App() {
  const [peerAlias, setPeerAlias] = useState();

  return (
    <div className="App">
      <PeerAliasSelector onChange={setPeerAlias} />
      {peerAlias && <CircuitRelayTest nodeId={peerAlias} />}
      {/* {peerAlias && <IpfsNode nodeId={peerAlias} />} */}
    </div>
  );
}

export default App;
