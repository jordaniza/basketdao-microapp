import { NextComponentType } from 'next';
import Image from 'next/image'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { injected } from 'connectors'
import Logo from './logo';
import Button from './button';

const formatAccount = (account?: string) => account && account.slice(0, 5) + '...' + account.slice(-5, )

export const ConnectWallet: NextComponentType = () => {
    const { connect, isConnected, isConnecting } = useConnect({
        connector: injected,
    });
    const { disconnect } = useDisconnect();
    const { data: account } = useAccount()
    // const { data: ensName } = useEnsName({ address: account?.address })
    return (
        <Button
            onClick={() => isConnected ? disconnect() : connect() }
            disabled={isConnecting}
            >{isConnecting ? 'Connecting...' : isConnected ? (formatAccount(account?.address)) : 'Connect Wallet'}
        </Button>
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

export const VerticalHeader: React.FC = () => {
    return (
        <section className='w-full h-full flex flex-col justify-evenly items-center'>
            <Logo />
            <ConnectWallet />
        </section>
    )
} 

export default Header