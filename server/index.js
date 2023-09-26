import express, { json } from 'express';
import cors from 'cors';
import { hexToBytes, toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import Transaction from './transaction.js';

const app = express();
const port = 3042;

app.use(cors());
app.use(json());

const balances = {
	'0x5a08be8d26d66a919a4bcbb3edfd47a2f4df940e': 100,
	'0xb961c21f90c3a7f77581060bfce55454f8b2e67b': 50,
	'0x0b369ce174f315276ff99312fd4a46dff41beda0': 75,
};

const nonces = {
	'0x5a08be8d26d66a919a4bcbb3edfd47a2f4df940e': 0,
	'0xb961c21f90c3a7f77581060bfce55454f8b2e67b': 0,
	'0x0b369ce174f315276ff99312fd4a46dff41beda0': 0,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	const { sender, recipient, amount, signature, hash, recoveryBit, nonce } = req.body;

	setInitialBalance(sender);
	setInitialBalance(recipient);

	const transaction = new Transaction(sender, recipient, amount, signature, recoveryBit, nonce);

	const verifyHash = transaction.verifyHash(hash);
	if (!verifyHash) {
		res
			.status(400)
			.send({ message: `Invalid hash. Expected: ${transaction.hash} but got: ${hash}` });
	}

	const verifySignature = transaction.verifySignature(hash);
	if (!verifySignature) {
		res.status(400).send({ message: 'Invalid signature' });
	}

	const verifySender = transaction.verifySender();
	if (!verifySender) {
		res.status(400).send({ message: 'Invalid sender' });
	}

	const senderHash = keccak256(hexToBytes(transaction.sender).slice(1));
	const transactionSender = `0x${toHex(senderHash).slice(-40)}`;

	if (nonce !== nonces[transactionSender]) {
		res.status(400).send({
			message: `Invalid nonce. Replay attack. Expected: ${nonces[transactionSender]} but got: ${nonce}`,
		});
	}

	if (balances[transactionSender] < transaction.amount) {
		res.status(400).send({ message: 'Insufficient Balance' });
	} else {
		balances[transactionSender] -= transaction.amount;
		balances[transaction.recipient] += transaction.amount;
		nonces[transactionSender] += 1;
		res.send({ balance: balances[transactionSender], nonce: nonces[transactionSender] });
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
