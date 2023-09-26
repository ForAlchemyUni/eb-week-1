import { useState, useEffect } from 'react';
import server from './server';
import { getPublicKey } from './utils';
import Transaction from './utils/transaction';

function Transfer({ privateKey, setBalance }) {
	const [sendAmount, setSendAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [nonce, setNonce] = useState(0);

	const setValue = (setter) => (evt) => setter(evt.target.value);

	useEffect(() => {
		if (privateKey) {
			const publicKey = getPublicKey(privateKey);
			const storedNonce = localStorage.getItem('nonce_' + publicKey);
			setNonce(storedNonce ? parseInt(storedNonce, 10) : 0);
		}
	}, [privateKey]);

	function saveNonce(updatedNonce) {
		if (privateKey) {
			const publicKey = getPublicKey(privateKey);
			localStorage.setItem('nonce_' + publicKey, updatedNonce.toString());
		}
	}

	async function transfer(evt) {
		evt.preventDefault();
		const sender = getPublicKey(privateKey);
		const transaction = new Transaction(sender, recipient, parseInt(sendAmount), nonce);
		transaction.signTransaction(privateKey);
		const data = { ...transaction };

		try {
			const {
				data: { balance, nonce },
			} = await server.post(`send`, data);
			setBalance(balance);
			setNonce(nonce);
			saveNonce(nonce);
		} catch (ex) {
			alert(ex.response.data.message);
		}
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="Enter amount to send"
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type recipient address"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type="submit" className="button" value="Transfer" />
		</form>
	);
}

export default Transfer;
