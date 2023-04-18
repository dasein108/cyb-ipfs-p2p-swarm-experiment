// eslint-disable-next-line import/no-unresolved
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
// import { Options } from "ipfs-core/dist/src/types";
// import { peerMap } from "./peerMap";
import { all, dnsWsOrWss } from "@libp2p/websockets/filters";

// import { peerIdFromString } from "@libp2p/peer-id";
import { webRTCStar } from "@libp2p/webrtc-star";
// import { MulticastDNS } from '@libp2p/mdns';
import { kadDHT } from "@libp2p/kad-dht";
import { mplex } from "@libp2p/mplex";
import { noise } from "@chainsafe/libp2p-noise";
import { createLibp2p } from "libp2p";
// import { webTransport } from "@libp2p/webtransport";
// import { circuitRelayTransport } from "libp2p/circuit-relay";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";

import { webRTCDirect } from "@libp2p/webrtc-direct";
import { bootstrap } from "@libp2p/bootstrap";
import { delegatedContentRouting } from "@libp2p/delegated-content-routing";

import { delegatedPeerRouting } from "@libp2p/delegated-peer-routing";
import { create as kuboClient } from "kubo-rpc-client";

// default is to use ipfs.io
const client = kuboClient({
  // use default api settings
  protocol: "https",
  port: 443,
  // host: "node0.delegate.ipfs.io",
  host: "swarm.io.cybernode.ai",
});

// import { tcp } from "@libp2p/tcp";
// const ws = webSockets({
//   filter: all,
//   // websocket: {
//   //   protocol: 'wss',
//   // },
// });
const nodeLibp2p = (opts) => {
  const wrtcStar = webRTCStar();
  const peerId = opts.peerId;
  console.log("------opts", opts.libp2pOptions);
  return createLibp2p({
    peerId,
    pubsub: gossipsub(),
    addresses: {
      listen: [
        "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      ],
    },
    dht: kadDHT(),
    // transports: [webRTC.transport, ws, webRTCDirect(), webTransport()],
    transports: [
      webSockets(),
      wrtcStar.transport,
      webRTCDirect(),
      // circuitRelayTransport(),
    ],
    streamMuxers: [mplex()],
    peerDiscovery: [
      wrtcStar.discovery,
      bootstrap({
        list: [
          "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star",
        ],
      }),
    ],
    peerRouters: [delegatedPeerRouting(client)],
    contentRouters: [delegatedContentRouting(client)],
    connectionEncryption: [noise()],
    nat: {
      enabled: true,
    },
  });
};

const configIpfs = (nodeId) => {
  // const peer = peerIdFromString(peerMap[nodeId]);
  // console.log(`Create config for ${nodeId}`, peer.publicKey.to());
  return {
    // init: {
    //   privateKey: peer,
    // },
    start: true,
    // repo: 'ipfs-repo-cyber-v2',
    repo: `ok-${nodeId}`, // TODO: refactor! every launch new repo created
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true,
      },
    },
    // preload: // TODO: research this feature
    config: {
      API: {
        HTTPHeaders: {
          "Access-Control-Allow-Methods": ["PUT", "POST"],
          "Access-Control-Allow-Origin": [
            "http://localhost:3000",
            "http://127.0.0.1:5001",
            "http://127.0.0.1:8888",
            "http://localhost:8888",
          ],
        },
      },
      Addresses: {
        // Gateway: "/ip4/127.0.0.1/tcp/8080",
        Swarm: [
          // "/ip4/0.0.0.0/tcp/4001",
          // "/ip4/0.0.0.0/tcp/4003/ws",
          // "/ip4/0.0.0.0/tcp/4002/ws",
          // "/ip4/0.0.0.0/tcp/443/wss",
          // "/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB",
          "/dns4/ws-star.discovery.cybernode.ai/tcp/443/wss/p2p-webrtc-star",
          // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
          // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        ],
        Delegates: [
          "/dns4/node0.delegate.ipfs.io/tcp/443/https",
          "/dns4/node1.delegate.ipfs.io/tcp/443/https",
          "/dns4/node2.delegate.ipfs.io/tcp/443/https",
        ],
      },
      Discovery: {
        MDNS: {
          Enabled: true,
          Interval: 10,
        },
        webRTCStar: {
          Enabled: true,
        },
      },
      // Peering: {
      //   Peers: null,
      // },
      Bootstrap: [
        // "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        // "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        // "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
        // "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        // "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        "/dns4/ws-star.discovery.cybernode.ai/tcp/4430/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB",
      ],
      Pubsub: {
        PubSubRouter: "gossipsub", // <-- added
        Enabled: true,
      },
      Swarm: {
        ConnMgr: {
          HighWater: 300,
          LowWater: 50,
        },
        DisableNatPortMap: false,
      },
      Routing: {
        Type: "dhtclient",
      },
    },
    libp2p: nodeLibp2p,

    // libp2p: {
    //   transports: [webSockets()],
    //   nat: {
    //     enabled: true,
    //   },
    // },
    EXPERIMENTAL: {
      ipnsPubsub: true,
    },
  };
};

export default configIpfs;
