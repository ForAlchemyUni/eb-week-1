import server from './server';
import { getWalletAddress } from './utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
	async function onChange(evt) {
		const privateKey = evt.target.value;
		setPrivateKey(privateKey);
		// don't set address until we have a valid private key
		setAddress('');
		const address = getWalletAddress(privateKey);
		if (address) {
			setAddress(address);
			const {
				data: { balance },
			} = await server.get(`balance/${address}`);
			setBalance(balance);
		} else {
			setBalance(0);
		}
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Private Key
				<input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
			</label>

			<label>
				Address
				<input disabled value={address}></input>
			</label>

			<div className="balance">Balance: {balance}</div>
		</div>
	);
}

export default Wallet;
