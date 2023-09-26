import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { sha256 } from 'ethereum-cryptography/sha256';

class Transaction {
	constructor(sender, recipient, amount, signature, recoveryBit, nonce) {
		this.sender = sender;
		this.recipient = recipient;
		this.amount = amount;
		this.signature = signature;
		this.recoveryBit = recoveryBit;
		this.nonce = nonce;
		this.hash = this.toHash();
	}

	toHash() {
		return toHex(sha256(utf8ToBytes(`${this.sender}${this.recipient}${this.amount}${this.nonce}`)));
	}

	verifyHash(hash) {
		return this.hash === hash;
	}

	verifySignature(hash) {
		const r = this.signature.slice(0, 64);
		const s = this.signature.slice(64, 128);
		const signature = {
			r: BigInt(`0x${r}`),
			s: BigInt(`0x${s}`),
		};
		return secp.verify(signature, hash, this.sender);
	}

	verifySender() {
		const r = this.signature.slice(0, 64);
		const s = this.signature.slice(64, 128);
		const signature = new secp.Signature(BigInt(`0x${r}`), BigInt(`0x${s}`), this.recoveryBit);
		const publicKey = signature.recoverPublicKey(this.hash);
		return publicKey !== this.sender;
	}
}

export default Transaction;
