import { useState } from 'react';
import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';

function App() {
	const [balance, setBalance] = useState(0);
	const [address, setAddress] = useState('');
	const [privateKey, setPrivateKey] = useState('');

	return (
		<div className="app">
			<Wallet
				balance={balance}
				privateKey={privateKey}
				setPrivateKey={setPrivateKey}
				setBalance={setBalance}
				address={address}
				setAddress={setAddress}
			/>
			<Transfer setBalance={setBalance} privateKey={privateKey} />
		</div>
	);
}

export default App;
