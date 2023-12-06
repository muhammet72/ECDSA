const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const privateKey =
  "d3cbc30e2b74a06cb465d268933efc83c88ef02901bf0e40bae573d1b04536af";
const messageHash =
  "acc8c9b209e1b44817a9e314c82616fb869b15733b8e3ed75bf54da2b5c3d322";

const signature = secp256k1.sign(messageHash, privateKey);
console.log(signature.toCompactHex());
