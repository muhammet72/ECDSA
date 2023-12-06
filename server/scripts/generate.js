const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const secp2 = require("ethereum-cryptography/secp256k1-compat");
const { randomBytes } = require("crypto");

// secp (secp256k1) is not working thats why these codes are not working
// i used secp2 (secp256k1-compat)
// ------------------------------------------------
const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("Private Key:", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("Public Key:", toHex(publicKey));
// -----------------------------------------------------

const address = keccak256(publicKey.slice(1)).slice(-20);

console.log("address:", toHex(address));

// const privateKey = secp2.createPrivateKeySync();
// console.log("Private Key:", toHex(privateKey));
// Generate private key
// let privateKey;
// do {
//   privateKey = randomBytes(32);
// } while (!secp2.privateKeyVerify(privateKey));
// console.log("Private key:", toHex(privateKey));

// Derive public key in a compressed format
// const publicKey = secp2.publicKeyCreate(privateKey);
// console.log("Public key:", toHex(publicKey));
