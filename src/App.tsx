// import { ethers } from 'ethers';
// import { useState } from 'react';
// import { useWeb3Auth } from './useWeb3Auth';
import { useEthersSigner } from './hooks/useEthersSigner';
import useWeb3Auth from './hooks/useWeb3Auth';
import useGlobalStore from './store';
function App() {
    // const [clipSigner, setClipSigner] = useState('');

    const signer = useEthersSigner();
    const { login } = useWeb3Auth();
    const storeAddressInExtension = () => {
        if (signer) {
            window.postMessage({ type: 'STORE_ADDRESS', address: signer }, '*');
        } else {
            console.warn('No address available to send');
        }
        // if (signer) {
        //     console.log('Sending signer via window.postMessage:', signer);
        //     window.postMessage({ type: 'STORE_SIGNER', signer }, '*');
        // } else {
        //     console.warn('No address available to send');
        // }
    };
    // const fetcherOn = async () => {
    //     try {
    //         const res = await fetch(
    //             'https://8ee5-129-126-214-63.ngrok-free.app/api/contracts/txn-data',
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     id: '66e6dae092e5dd1952968734',
    //                     functionName: 'increment',
    //                     signerAddress: address,
    //                     args: [],
    //                 }),
    //             }
    //         );
    //         const data = await res.json();
    //         console.log(data);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    // const handleSend = async () => {
    //     const joinTeamTransaction = {
    //         to: '0xEb53aED2ad03a20489926dCcA07f5a0CDa553522',
    //         data: '0xd09de08a',
    //     };
    //     const provider = new ethers.JsonRpcProvider(
    //         'https://rpc.ankr.com/eth_sepolia'
    //     );
    //     const wallet = new ethers.Wallet(clipSigner, provider);
    //     console.log(wallet);
    //     const transactionResponse = await wallet?.sendTransaction(
    //         joinTeamTransaction
    //     );
    //     console.log('Transaction sent, waiting for confirmation...');
    //     const receipt = await transactionResponse?.wait();
    //     console.log('Transaction receipt:', receipt);
    // };
    // async function getClipboardData() {
    //     try {
    //         const text = await navigator.clipboard.readText();
    //         setClipSigner(text);
    //     } catch (err) {
    //         console.error('Failed to read clipboard data:', err);
    //     }
    // }
    // const { login, getSignerValue, getAccounts } = useWeb3Auth();
    // const signerFunc = async () => {
    //     const res = await getSignerValue();
    //     window.postMessage({ type: 'STORE_ADDRESS', address: res }, '*');
    // };
    // const handleAddress = async () => {
    //     const res = await getAccounts();
    //     console.log(res);
    // };
    const handleCall = async () => {
        let chatQuery = 'Who are you?';
        let model = 'o1-preview';
        const obj = {
            chatQuery,
            model,
        };
        const response = await fetch(
            `https://wapo-testnet.phala.network/ipfs/QmbzK3mvM6MVJrRBHp9EJa9smKCYhCGvs6YMoSSMhf3nFc`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(obj),
            }
        );

        const res = await response.json();
        console.log(res);
    };
    return (
        <div>
            <div onClick={() => handleCall()}>call api</div>

            {/* <div onClick={fetcherOn}>api fetcher</div>
            <div onClick={handleSend}>Send transaction</div>
            <div onClick={getClipboardData}>Store</div>
            <div onClick={login}>Web3connect</div>
            <div onClick={signerFunc}>Store for signer</div>
            <div onClick={handleAddress}>get address</div> */}
        </div>
    );
}

export default App;
