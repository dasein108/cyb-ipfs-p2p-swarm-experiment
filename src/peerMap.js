// const PeerId = require("peer-id");
import { createEd25519PeerId } from "@libp2p/peer-id-factory";
// import { peerIdFromString } from "@libp2p/peer-id";

const peerAliases = [
  "Cassiopea",
  "Venus",
  "Moon",
  "Earth",
  "Pluto",
  "Saturn",
  "Sputnik",
  "Sun",
  "Punk",
  "Human",
  "Carbon",
  "Neuron",
];
// export const peerMap = {
//   "Cassiopea.0": "12D3KooWMXvPki5sP2Ybbsged7WQuZS5rprhQ1YuEynyJbgdHeyj",
//   "Cassiopea.1": "12D3KooWA1xNnRL6JcG7uJDu3E5ShJNRdcfXNSFw85KAX4Am31KG",
//   "Cassiopea.2": "12D3KooWK8SJfXzDkX4p7e2iezhguxbgQaMMXJkYh71KQumUeeV4",
//   "Venus.0": "12D3KooWAjmW9QiqGwYP6TSJZfno4jRyGZ2aMdKjeYxWszrs7TDu",
//   "Venus.1": "12D3KooWRijF7UxJFHnS5CQP1LNdnTZPnXgxp8vNn53KNFwt7yrN",
//   "Venus.2": "12D3KooWAVt28wVewhBsfZmoZdi9PvFQyihy3YtHtnBbctu6ah4N",
//   "Moon.0": "12D3KooWK7vzhgL8yu3RvNAP8jhLR7PXmheqdHMPskQNDdnvTZ78",
//   "Moon.1": "12D3KooWJMYAHhRg5LN6zsAYDqBWT5RRjitzK5Aft5UfrZfBK7A3",
//   "Moon.2": "12D3KooWRPbkQ4J9w4T6AG3gXr9vMqimH7RjTF8UoGwMrcjyvGKU",
//   "Earth.0": "12D3KooWGUDwBpWzmUKnQeyjEN39jH6wbDQYVusHZU61gXTGZkCV",
//   "Earth.1": "12D3KooWA4nJ9HSBYGnExsneXgy5xsTtQx6DkbYftbZftB5fAiBm",
//   "Earth.2": "12D3KooWGWi1W1N1HTKNKTWtPc59RMM5D3Y5JomnDPpxbXyQVdx4",
//   "Pluto.0": "12D3KooWRaLLywc4VstgbPYFoJDZ67gMgKLqTj7Rq8WcSp3uDgLF",
//   "Pluto.1": "12D3KooWE3piPMAwuTfqKhaucApVRVumA3dReDKiGKzCcBQ6Dwgt",
//   "Pluto.2": "12D3KooWFYqyQvCJEfWNcuXuReA8qLFRdHWeK1SkF1Wqngf5Gd6k",
//   "Saturn.0": "12D3KooWK6kMo9mGjCs8kuGMWS17fJp2L2rjgfA1WomLGkz8YDqo",
//   "Saturn.1": "12D3KooWK5N2xrxdM7jxjzg77xy9XCPuW87DdnN3TuYaetrqrrjs",
//   "Saturn.2": "12D3KooWSYjCNYGBzU8W2EvKwGx5pj8nsefXMitQv473xPwSLgGK",
//   "Sputnik.0": "12D3KooWLEB9Z73Zxt8Vzwbye6gNk7LJ7a87VxszCXEjdh43gWGo",
//   "Sputnik.1": "12D3KooWCBE1AfD6bmzbKjxGrwXNjJyKxBUcehBpK4K2g1fwMkdj",
//   "Sputnik.2": "12D3KooWLaKuhnUsV6gFQoCy4yVxdACpTJrCoZyUSURG3GTXGnL2",
//   "Sun.0": "12D3KooWJ37tgHiDpxnxmLo3pLyQGEg93Y7SnfZYM1kiDy3ppcor",
//   "Sun.1": "12D3KooWGDeQoVhKVKcQj3wDygoiUY3JgCzhd5S2Wf9r4CzGAVns",
//   "Sun.2": "12D3KooWNXB3pVH57peAWda7C7YBqrBnk19rf3WJ4cPz7XM4ZVnG",
//   "Punk.0": "12D3KooWNhJzNNdDyQjGXdKqc5GgTg3WeD7MVefdC9cdJxjnWTBR",
//   "Punk.1": "12D3KooWNcyvX4BTJEbG3eouLCeXStAgAuQoPdAn2LUhiP34HJXL",
//   "Punk.2": "12D3KooWPqHhdBek6nDfWRPsDWZavckyoE6SrfrNZhX8RAFHNcfD",
//   "Human.0": "12D3KooWCy3eLjqYoCSJUFpWPB42sVeeZhRrWpN99Mip6sevSY3t",
//   "Human.1": "12D3KooWL4qNvBjNPCKqeMkQG2x9x2EyV4aYrMdyS4PPsPzAcgyW",
//   "Human.2": "12D3KooWSJwEU5szEf9bcYEL9i23uzazTpXTEdfQGAR6aKmXx8BN",
//   "Carbon.0": "12D3KooWQAacQLZB9vz3sYGaNZUoArhQkWUaQPWTxuofMwSkWDTq",
//   "Carbon.1": "12D3KooWDtcW9rQ4oWk9xSWEfBeBuNhcXbN4hBfJSAHybqDbaVF6",
//   "Carbon.2": "12D3KooWGNzuTdU22GKiZTM4ngcLHTKGkmrjTbZphcAUb381Ku6n",
//   "Neuron.0": "12D3KooWEHp4mu8NFpoepqUy8JSrg7kRDwpHpiC2Z2byxQzqm21H",
//   "Neuron.1": "12D3KooWQPwvTS2KbkerVB11QNEc9e1fnLgbMEGH6PQgN9hHu5gt",
//   "Neuron.2": "12D3KooWRpsR9EM5RU4tHS6hFdtFTEHLtBxAYaEdkRJ6YuBiF8LE",
// };

const peerMap = {};

const revPeerMap = {};

export const setPeerMap = (name, peerId) => {
  peerMap[name] = peerId;
  revPeerMap[peerId] = name;
};

export const getPeerIdByAlias = (aliasName) => peerMap[aliasName] || undefined;

export const getNodePeersByAlias = (name, length) => {
  return Array.from({ length }, (v, i) => `${name}.${i}`);
};

export async function generatePeerId() {
  return await createEd25519PeerId({ bits: 2048 });
}

export const generatePeerMapFromAliases = async (count) => {
  let result = {};
  peerAliases.forEach(async (name) => {
    getNodePeersByAlias(name, 3).forEach((name) => (result[name] = null));
  });

  for await (const name of Object.keys(result)) {
    const peerId = await generatePeerId();
    result[name] = peerId.toString();
  }
  console.log(JSON.stringify(result));
  return result;
};

// const revPeerMap = Object.fromEntries(
//   Object.entries(peerMap).map(([k, v]) => [v, k])
// );

export const getPeerAlias = (peerId) => revPeerMap[peerId] || peerId;
