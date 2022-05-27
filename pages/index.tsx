import Balance from "@components/balance";
import ConnectWallet from "@components/connectWallet";
import DepositButton from "@components/depositButton";
import Logo from "@components/logo";
import { NotificationDisplay } from "@components/notification";
import { BigNumber } from "ethers";
import { useBDITokenContract, useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { thunkGetData } from "store/thunks";
import { useAccount, useEnsName } from "wagmi";

const content = `
This page is a mockup of the content that we will use for the PieDAO/BasketDAO acquisition, giving
BDI hodlers the chance to exchange their index tokens for DEFI++ and, depending on the final deposits, DOUGH.
`;

const useOnChainData = () => {
  const bdi = useBDITokenContract();
  const migrator = useMigratorContract();
  const dispatch = useAppDispatch();
  const { data: account } = useAccount();

  useEffect(() => {
    dispatch(thunkGetData({ bdi, migrator, account: account?.address }));
  }, [bdi, migrator, account, dispatch]);
};

const Dapp: NextPage = () => {
  const [state] = useStoreState();
  useOnChainData();

  return (
    <>
      <Head>
        <title>Deposit BDI Tokens | PieDAO</title>
        <meta
          name="description"
          content="Quickly and easily burn JustCarbon Removal tokens, directly on the ethereum blockchain with metamask."
        />
      </Head>
      <div className='w-screen h-screen justify-center items-center flex bg-cover bg-[url("../public/background.jpg")]'>
        <NotificationDisplay />
        <div
          className="
                    mt-5 p-5 w-11/12 max-w-[900px]
                    shadow-lg rounded-xl h-3/4
                    flex flex-col items-center justify-evenly 
                    bg-white
                    bg-opacity-30
                    border-8 border-white
                    "
        >
          <Logo />
          <p className="text-3xl font-bold text-primary-dark">
            Deposit BDI Tokens
          </p>
          <p className="text-gray-600 text-center w-10/12">{content}</p>
          <ConnectWallet />
          <Balance />
          <DepositButton max={BigNumber.from(state.balance)} />
        </div>
      </div>
    </>
  );
};

export default Dapp;
