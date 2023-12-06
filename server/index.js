// const express = require("express");
// const app = express();
// const cors = require("cors");
// const port = 3042;

// app.use(cors());
// app.use(express.json());

// const balances = {
//   "03c6b43b980f84c89c3981c802378270e4255e022fc006ba1d680d7134d5fe7407": 100,
//   "022b75f9cda45c51a91bb58d29e313b8a666e6d2b001720ac0854b8cc6b1fd7608": 50,
//   "03d5035c0cd475aa2b9266e16351fb1d4aae49dba095ac753a491a9318f4286a75": 75,
// };

// app.get("/balance/:address", (req, res) => {
//   const { address } = req.params;
//   const balance = balances[address] || 0;
//   res.send({ balance });
// });

// app.post("/send", (req, res) => {
//   // TODO : get signer from client side application
//   // recover the public key from the signature

//   const { sender, recipient, amount } = req.body;

//   setInitialBalance(sender);
//   setInitialBalance(recipient);

//   if (balances[sender] < amount) {
//     res.status(400).send({ message: "Not enough funds!" });
//   } else {
//     balances[sender] -= amount;
//     balances[recipient] += amount;
//     res.send({ balance: balances[sender] });
//   }
// });

// app.listen(port, () => {
//   console.log(`Listening on port ${port}!`);
// });

// function setInitialBalance(address) {
//   if (!balances[address]) {
//     balances[address] = 0;
//   }
// }

const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03c6b43b980f84c89c3981c802378270e4255e022fc006ba1d680d7134d5fe7407": 100,
  "022b75f9cda45c51a91bb58d29e313b8a666e6d2b001720ac0854b8cc6b1fd7608": 50,
  "03d5035c0cd475aa2b9266e16351fb1d4aae49dba095ac753a491a9318f4286a75": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/verify", (req, res) => {
  const { signature, address } = req.body;

  if (verifySignature(signature, address)) {
    res.send({ isValid: "Success!" });
  } else {
    res.send({ isValid: "Signature is not valid!" });
  }
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, txHash, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!verifySignature(signature, sender, txHash)) {
    res.status(400).send({ message: "Signature is not valid!" });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function verifySignature(signature, address, messageHash) {
  try {
    const sig = secp256k1.Signature.fromCompact(signature);
    for (let i = 0; i < 4; i++) {
      let publicKey = sig
        .addRecoveryBit(i)
        .recoverPublicKey(messageHash)
        .toRawBytes();
      let publicKeyHash = keccak256(publicKey.slice(1));
      let recoveredAddress = toHex(
        publicKeyHash.slice(publicKeyHash.length - 20)
      );
      if (recoveredAddress === address) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
