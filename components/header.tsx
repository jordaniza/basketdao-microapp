import { NextComponentType } from 'next';
import Image from 'next/image'
import { useAccount, useConnect, useContractWrite, useDisconnect, useEnsName } from 'wagmi'
import { injected } from 'connectors'

const ConnectWallet: NextComponentType = () => {
    const { connect, isConnected } = useConnect({
        connector: injected,
    });

    const { disconnect } = useDisconnect();
    const { data: account } = useAccount()
    // const { data: ensName } = useEnsName({ address: account?.address })
    return (
        <button
            onClick={() => isConnected ? disconnect() : connect() }
            className='px-2 py-1 rounded-sm shadow-md hover:bg-gray-100 transition-all delay-75'
        >{isConnected ? (account?.address) : 'Connect Wallet'}</button>
    )
}

const Header: NextComponentType = () => {
    return (
        <header className='w-full flex justify-between p-2'>
            <Image src="/favicon.ico" alt='Logo' height={24} width={36} />
            <p>JustCarbon Burn</p>
            <ConnectWallet />
        </header>
    )
}

export default Header