import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

const privateKey = toHex(secp.utils.randomPrivateKey());
const publicHash = keccak256(secp.getPublicKey(privateKey).slice(1)).slice(-20);
const walletAddress = `0x${toHex(publicHash)}`;

console.log(`Private key: ${privateKey}`);
console.log(`Wallet Address: ${walletAddress}`);
