// eslint-disable-next-line import/no-unresolved
// import { Options } from "ipfs-core/dist/src/types";
// import { peerMap } from "./peerMap";
import { all, dnsWsOrWss } from "@libp2p/websockets/filters";

// import { peerIdFromString } from "@libp2p/peer-id";
// import { MulticastDNS } from '@libp2p/mdns';
// import { webTransport } from "@libp2p/webtransport";
// import { circuitRelayTransport } from "libp2p/circuit-relay";

import { createNodeLibp2p } from "./createNodeLibp2p";

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
          "Access-Control-Allow-Origin": ["*"],
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
          // "/dns4/static.187YRS8.86.140.128.clients.your-server.de/tcp/4002/ws/p2p/12D3KooWS9usCuXz8ZkNEAMcTyW956EuSPLevEsYDDnDpmA5M7kj",
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
    libp2p: createNodeLibp2p,

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
