import Balance, { Loader } from '@components/balance'
import BurnButton from '@components/burnButton'
import{ ConnectWallet } from '@components/header'
import Logo from '@components/logo'
import { toast } from 'react-toastify'
import { BigNumber } from 'ethers'
import { useBalance } from 'hooks/useContract'
import { NextPage } from 'next'
import { NotificationDisplay } from '@components/notification'

const content = `
Burning JCRs is as simple as connecting your Metamask wallet, and hitting 'Burn' below.

Please make sure you have enough Eth in your wallet to execute the transaction. Depending on the time, and how busy the network is, this can get more or less expensive.

After hitting burn, either wait for the notification or check metamask to confirm your burn is processed.

`

const Dapp: NextPage = () => {
    const { balance } = useBalance();     
    return (
        <div className='w-screen h-screen justify-center items-center flex bg-cover bg-[url("../public/background.jpg")]'>
                <NotificationDisplay />
                <div className='
                    mt-5 p-5 w-11/12 max-w-[900px]
                    shadow-lg rounded-xl h-3/4
                    flex flex-col items-center justify-evenly 
                    bg-white
                    bg-opacity-30
                    border-8 border-white
                    '>
                    <Logo />
                    <p className='text-3xl font-bold text-primary-dark'>Burn JCRs</p>
                    <p className='text-gray-600 text-center w-10/12'>{content}</p>
                    <ConnectWallet />
                    <Balance />
                    <BurnButton max={balance ? balance : BigNumber.from(0)} />
                </div>
        </div>
    )
}

export default Dapp