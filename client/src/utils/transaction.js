import { getPublicKey } from './';
import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { sha256 } from 'ethereum-cryptography/sha256';

class Transaction {
	constructor(sender, recipient, amount, nonce) {
		this.sender = sender;
		this.recipient = recipient;
		this.amount = amount;
		this.nonce = nonce;
		this.hash = this.toHash();
	}

	toHash() {
		return toHex(sha256(utf8ToBytes(this.sender + this.recipient + this.amount + this.nonce)));
	}

	signTransaction(privateKey) {
		const hexAddress = getPublicKey(privateKey);
		if (hexAddress !== this.sender) {
			throw new Error('Cannot sign transactions for unauthorized wallets');
		}
		const { r, s, recovery } = secp.sign(this.hash, privateKey);
		const rHex = r.toString(16).padStart(64, '0');
		const sHex = s.toString(16).padStart(64, '0');
		this.signature = rHex + sHex;
		this.recoveryBit = recovery;
	}
}

export default Transaction;
