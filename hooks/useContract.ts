import { Jcr } from "abi/types/JCR";
import { addresses } from "constants/addresses";
import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import JCRABI from 'abi/json/jcr.json'
import { BigNumber } from "ethers";
import { useStoreBalance } from "./useStore";

export const useJCRContract = (): Jcr | undefined => {
    const { data: signer }  = useSigner();
    const provider = useProvider();
    const contract = useContract<Jcr>({
        addressOrName: addresses.contracts.JCR,
        contractInterface: JCRABI,
        signerOrProvider: signer ?? provider
    })
    return contract
};

export const useBalance = (): { balance: BigNumber | undefined; isLoading: boolean } => {
    const [balance, setBalance] = useStoreBalance(); 
    const [isLoading, setIsLoading] = useState(false);
    const JCRContract = useJCRContract();
    const { data: account } = useAccount();
    

    useEffect(() => {
        if (!account?.address || !JCRContract) return;
        setIsLoading(true)
        JCRContract.balanceOf(account.address)
            .then(b => setBalance(b.toString()))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [account?.address]);

    return {
        balance, isLoading
    }
};

export const useDecimals = (): { decimals: number | undefined; isLoading: boolean } => {
    const [decimals, setDecimals] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const JCRContract = useJCRContract();
    const { data: account } = useAccount()
    
    useEffect(() => {
        if (!account?.address || !JCRContract) return;
        setIsLoading(true)
        JCRContract.decimals()
            .then(setDecimals)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [account?.address]);

    return {
        decimals, isLoading
    }    

}


