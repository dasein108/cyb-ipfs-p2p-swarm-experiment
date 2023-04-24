import { mplex } from "@libp2p/mplex";
import { createLibp2p } from "libp2p";
import { noise } from "@chainsafe/libp2p-noise";
import { circuitRelayServer } from "libp2p/circuit-relay";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
// import {
//   createEd25519PeerId,
// } from "@libp2p/peer-id-factory";
import { peerIdFromKeys } from "@libp2p/peer-id";

// const peerId = await createEd25519PeerId();
// console.log("PeerId priv", Buffer.from(peerId.privateKey).toString("base64"));
// console.log("PeerId pub", Buffer.from(peerId.publicKey).toString("base64"));

// Expected: PeerId = 12D3KooWHWZbPWceAaHyXmdrvgL6sqjzHy5nH4su7A18XYDTn3Jr
const privateKeyString =
  "CAESQG9exoIlp3fiprNznErw3zR02hLhw1T2KCb1qSSl6lhCck31guU58WIzXhlXP7t5RJbQhyUZxsrYRl4HBxE/Jjs=";
const publicKeyString = "CAESIHJN9YLlOfFiM14ZVz+7eUSW0IclGcbK2EZeBwcRPyY7";

const toBuffer = (str) => Buffer.from(str, "base64");

const peerId = await peerIdFromKeys(
  toBuffer(publicKeyString),
  toBuffer(privateKeyString)
);

const server = await createLibp2p({
  peerId,
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/4441/ws"],
  },
  transports: [
    webSockets({
      filter: filters.all,
    }),
  ],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
  relay: circuitRelayServer({}),
});

console.log(
  "p2p addr: ",
  server.getMultiaddrs().map((ma) => ma.toString())
);
