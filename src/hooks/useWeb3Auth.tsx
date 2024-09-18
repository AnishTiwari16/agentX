import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/modal';
// IMP END - Quick Start
import { useEffect, useState } from 'react';
import useGlobalStore from '../store';

const clientId =
    'BMOrKGsNSuifb5MOhmMmJOrkptD_vHNpAJ54OIV684-T1BQ5ccoz4JMF6W8bkIlnw5_qaFOEDwNBVhpAwUGClQ4';
// IMP END - Dashboard Registration

// IMP START - Chain Config
const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xaa36a7',
    rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: 'Ethereum Sepolia Testnet',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};
// IMP END - Chain Config

// IMP START - SDK Initialization
const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});
// IMP END - SDK Initialization

function useWeb3Auth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const { setSigner } = useGlobalStore();
    useEffect(() => {
        const init = async () => {
            try {
                // IMP START - SDK Initialization
                await web3auth.initModal();

                // IMP END - SDK Initialization
                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);
    useEffect(() => {
        if (loggedIn) {
            getSignerValue();
        }
    }, [loggedIn]);
    const login = async () => {
        // IMP START - Login
        if (web3auth.connected) {
            setLoggedIn(true);
        }
        // IMP END - Login
    };

    const getSignerValue = async () => {
        const signer = (await web3auth.provider?.request({
            method: 'eth_private_key',
        })) as string;
        const res = await signer;
        setSigner(res);
    };
    return { login, getSignerValue };
}
export default useWeb3Auth;
