import Balance from '@components/balance'
import BurnButton from '@components/burnButton'
import Header from '@components/header'
import { BigNumber } from 'ethers'
import { useBalance } from 'hooks/useContract'
import { NextPage } from 'next'

const Dapp: NextPage = () => {
    const { balance } = useBalance();
    return (
        <div className='w-screen h-screen justify-center'>
            <Header />
            <section className='w-full h-full flex items-start mt-10 justify-center'>
                <div className='w-3/4 shadow-lg rounded-lg h-1/3 flex flex-col items-center justify-center'>
                    <p className='text-xl font-bold'>Burn JCRs</p>
                    <Balance />
                    <BurnButton max={balance ? balance : BigNumber.from(0)} />
                </div>
            </section>
        </div>
    )
}

export default Dapp