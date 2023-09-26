import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

const hashMessage = (message) => {
	const bytes = utf8ToBytes(message);
	return keccak256(bytes);
};

const getPublicKey = (privateKey) => {
	return toHex(secp.getPublicKey(privateKey));
};

const getWalletAddress = (privateKey) => {
	let publicKey;
	try {
		publicKey = secp.getPublicKey(privateKey);
	} catch (e) {
		// prevent console errors from showing up in the browser
		// when the key is not 64 characters long
		return null;
	}
	return `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`;
};

const signMessage = (msgHash, privateKey) => {
	return secp.sign(msgHash, privateKey);
};

export { hashMessage, getPublicKey, getWalletAddress, signMessage };
