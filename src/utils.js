import { multiaddr } from "@multiformats/multiaddr";

export const connectToSwarm = async (node, address) => {
  const multiaddrSwarm = multiaddr(address);
  console.log(`Connecting to swarm ${address}`);
  await node.bootstrap.add(multiaddrSwarm).then((resp) =>
    console.log(
      "Bootstraped with",
      resp.Peers.map((p) => p.toString())
    )
  );

  node?.swarm
    .connect(multiaddrSwarm)
    .then((resp) => {
      console.log(`Welcome to swarm ${address} 🐝🐝🐝`);
      node.swarm.peers().then((peers) =>
        console.log(
          "Swarm addrs:",
          peers.map((p) => p.addr.toString())
        )
      );
    })
    .catch((err) => {
      console.log(
        "Error object properties:",
        Object.getOwnPropertyNames(err),
        err.stack,
        err.errors,
        err.message,
        err.code,
        err.name,
        err.props,
        err.isTrusted,
        err.code
      );
      console.log(`Can't connect to swarm ${address}: ${JSON.stringify(err)}`);
    });
};
