import { BiconomySmartAccountV2 } from '@biconomy/account';
import { create } from 'zustand';

interface GlobalStore {
    signer: string | null;
    setSigner: (signer: string) => void;
    smartAddress: string | null;
    setSmartAddress: (smartAccount: string | null) => void;
    smartAccount: BiconomySmartAccountV2 | null;
    setSmartAccount: (smartAccount: BiconomySmartAccountV2) => void;
}

const useGlobalStore = create<GlobalStore>()((set) => ({
    signer: null,
    setSigner: (signer) => set({ signer: signer }),
    smartAddress: null,
    setSmartAddress: (smartAddress) => set({ smartAddress: smartAddress }),
    smartAccount: null,
    setSmartAccount: (smartAccount) => set({ smartAccount: smartAccount }),
}));

export default useGlobalStore;
