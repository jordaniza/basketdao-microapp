import { NextComponentType } from 'next';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { injected } from 'connectors'
import Logo from './logo';
import Button from './button';

const formatAccount = (account?: string): string => account ? account.slice(0, 5) + '...' + account.slice(-5, ) : 'ERROR';

const useAccountName = (isConnected = false): string => {
    const { data: account } = useAccount();
    console.debug({ account })
    // const { data: ensName } = useEnsName({ address: account?.address, chainId: 1 })

    return isConnected 
        ? (formatAccount(account?.address)) 
        : 'Connect Wallet'
}

export const ConnectWallet: NextComponentType = () => {
    const { connect, isConnected, isConnecting } = useConnect({
        connector: injected,
    });
    const { disconnect } = useDisconnect();
    const accountName = useAccountName(isConnected);

    return (
        <Button
            onClick={() => isConnected ? disconnect() : connect() }
            disabled={isConnecting}
            >{isConnecting ? 'Connecting...' : accountName}
        </Button>
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