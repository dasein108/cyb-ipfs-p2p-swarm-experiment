// const PeerId = require("peer-id");
import { createEd25519PeerId } from "@libp2p/peer-id-factory";
import { peerIdFromKeys } from "@libp2p/peer-id";

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
export const peerMap = {
  Cassiopea0: {
    id: "12D3KooWLM2r7aoj7HP5bzEw2X7xjKJ42hAVVr96gNnYUEhWtJDu",
    privateKey:
      "CAESQFqVh8g0GMoMb4PXsnKP3dTMgI0QRM14DyT6hp8i6ElbnHAHHNjknj4F688qAWA7gb+I1UGgnHtRu5P/Wgwzrdg=",
    publicKey: "CAESIJxwBxzY5J4+BevPKgFgO4G/iNVBoJx7UbuT/1oMM63Y",
  },
  Venus0: {
    id: "12D3KooWQ4HNDBMUVyu9z5cpMn4tJU8ZZNYPBGbzEyv397y8roL7",
    privateKey:
      "CAESQKiBz8dmf6ZKyIrfToobC2v/GqM0D/bSXgjgA8uJpVkm05RRfPY//HuujNqr6MFfrBRjMGSYDO3rJY9P3Q9m7mQ=",
    publicKey: "CAESINOUUXz2P/x7rozaq+jBX6wUYzBkmAzt6yWPT90PZu5k",
  },
  Moon0: {
    id: "12D3KooWHWkSUfjAdpUXuCkWMjKzQN4TRHeax6h5KLnRfC7DToCN",
    privateKey:
      "CAESQHFhlnzGkyNzylh/4nDqKbz6Cwpd00xFyFyWEFnHMC6Cclo5GaXNlIvaF70V/sQ9q2A8Kc3WwFF6hVqFHXCvn1s=",
    publicKey: "CAESIHJaORmlzZSL2he9Ff7EPatgPCnN1sBReoVahR1wr59b",
  },
  Earth0: {
    id: "12D3KooWEyCYAEZkrSjkUL9NzWTHvXRFQGKCVD3U6jnEc6dn8k3E",
    privateKey:
      "CAESQNqiSZaZo0l0Ott85NLEFPvz0zCQpuFj5cfkNB0NPkQlTI3FuiUt2F2n/MFPE0BzKF+c+g5M/tJ7J/Oi46mtULU=",
    publicKey: "CAESIEyNxbolLdhdp/zBTxNAcyhfnPoOTP7SeyfzouOprVC1",
  },
  Pluto0: {
    id: "12D3KooWPkJof1SZuo4J8SvVZiVfHtcw9Rsb4TWPqve4gPJfseEz",
    privateKey:
      "CAESQJT/osJe7ZHxJLB4ymw+955U3xF85XOKsehvRA+lXbrmzvl9keCWGeoXxp4RS8ZSeJa67B88i5fDw9Rxs3YgwS8=",
    publicKey: "CAESIM75fZHglhnqF8aeEUvGUniWuuwfPIuXw8PUcbN2IMEv",
  },
  Saturn0: {
    id: "12D3KooWJD9ehEeWoUZffVa9opCqjsZDn5enn8DRMQjKEgksmsMC",
    privateKey:
      "CAESQLZ2We3ulflr98zUuzvosy+N5qPGpspRdatMdEXX8RKYfLOzIzwcfkyWSALI6kXaHzxUoZKQjhszksGfBKicUbs=",
    publicKey: "CAESIHyzsyM8HH5MlkgCyOpF2h88VKGSkI4bM5LBnwSonFG7",
  },
  Sputnik0: {
    id: "12D3KooWAdKTW43gwWCZb15mask61k6ogNM31hSMkJABzHdPqjwd",
    privateKey:
      "CAESQLl7/LlY2fcZDG4llZIZUkaW01zEGexnT8Wu6SyD0AUBDAc7i3hZRTyuHX87Qf0lVGzab3pijbLA4QsOKTvx8Cg=",
    publicKey: "CAESIAwHO4t4WUU8rh1/O0H9JVRs2m96Yo2ywOELDik78fAo",
  },
  Sun0: {
    id: "12D3KooWGfrgiHHSqoS87M6Pi9wzoRJL4QERsufm7jXMQbc2nPNM",
    privateKey:
      "CAESQE3OBbFEH0gGd5vAd4T2Nb82kIIm0PdHpH8hI6p8QLklZdPTO6DqmR+412cr9yePDH0r6e2U4ncc6ephR9pHvuY=",
    publicKey: "CAESIGXT0zug6pkfuNdnK/cnjwx9K+ntlOJ3HOnqYUfaR77m",
  },
  Punk0: {
    id: "12D3KooWFnGdvq2dVzGhVxzmUpUE8naBE32e1e8VVkxPqNpAqSWH",
    privateKey:
      "CAESQE99VcHhgjVOZintn7EwuqF9qOy4NkYT+UyWtb7eK3MOWJy0py210Yh9ZihN7fSyLT+HAlq2//hYQFemTOT6l9Y=",
    publicKey: "CAESIFictKcttdGIfWYoTe30si0/hwJatv/4WEBXpkzk+pfW",
  },
  Human0: {
    id: "12D3KooWD1cXb6LdGCDHFCJvzKTaNHeaK4rWF7SGe7NMxHuNvqLm",
    privateKey:
      "CAESQMJGFUyCL6s58NjycNTc4UwtDSK22qGiW7miz3UZhpTGL3Svlhd18drph+stwAQn2qeBlXFzN0kNw51UYoYrp9I=",
    publicKey: "CAESIC90r5YXdfHa6YfrLcAEJ9qngZVxczdJDcOdVGKGK6fS",
  },
  Carbon0: {
    id: "12D3KooWSTHfa9pN2vDTCx2UdpECpYzb5NtMTuBXoNDFqFUnod1a",
    privateKey:
      "CAESQAUMkjIVfbZvV2PD8idte/RFRnz0qsd96PW2+m+0CYBk9zBjpQv8Mu0uD5Ih+AeDAYKcA3M794xQOYawbuy2OZE=",
    publicKey: "CAESIPcwY6UL/DLtLg+SIfgHgwGCnANzO/eMUDmGsG7stjmR",
  },
  Neuron0: {
    id: "12D3KooWE3yj6jibgZcxMb6hrpQGKRE9xaqAazFkYaJZDZengzHq",
    privateKey:
      "CAESQB9Xr4AtsQX7Ls0CFDGcqjrj3sZsDimxZTUWwCCeeHcOPuuA7LeV+9yOoJLW6jbBT7wNp3MxJYaT1qpgoIDxZNw=",
    publicKey: "CAESID7rgOy3lfvcjqCS1uo2wU+8DadzMSWGk9aqYKCA8WTc",
  },
};

const revPeerMap = Object.fromEntries(
  Object.entries(peerMap).map(([k, v]) => [v, k])
);

export const setPeerMap = (name, peerId) => {
  peerMap[name] = peerId;
  revPeerMap[peerId] = name;
};

export const getNodePeersByAlias = (name, length) => {
  return Array.from({ length }, (v, i) => `${name}${i}`);
};

export const getPeerIdByAlias = (alias) => {
  return peerIdFromKeys(
    Buffer.from(peerMap[alias].publicKey, "base64"),
    Buffer.from(peerMap[alias].privateKey, "base64")
  );
};

export const getPeerAliasByPeerId = (peerId) => revPeerMap[peerId] || peerId;

// Generate peers
export async function generatePeerId() {
  return await createEd25519PeerId({ bits: 2048 });
}

export const generatePeerMapFromAliases = async (count) => {
  let result = {};
  peerAliases.forEach(async (name) => {
    getNodePeersByAlias(name, count).forEach((name) => (result[name] = null));
  });

  for await (const name of Object.keys(result)) {
    const peerId = await generatePeerId();
    result[name] = {
      id: peerId.toString(),
      privateKey: Buffer.from(peerId.privateKey).toString("base64"),
      publicKey: Buffer.from(peerId.publicKey).toString("base64"),
    };
  }
  console.log(JSON.stringify(result));
  return result;
};
