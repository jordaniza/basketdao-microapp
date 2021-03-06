import Balance from "@components/balance";
import ConnectWallet from "@components/connectWallet";
import DepositButton from "@components/depositButton";
import WithdrawButton from "@components/withdrawButton";
import { NotificationDisplay } from "@components/notification";
import { BigNumber } from "ethers";
import { useBDITokenContract, useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { thunkGetData } from "store/thunks";
import Logo from "public/logo.svg";
import { MigratorOpenState } from "../store/slice";
import { useAccount } from "wagmi";

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
      <div className="w-screen h-screen justify-center items-center flex bg-[linear-gradient(90deg,_#FFFFFF_33.333%,_#6C5DFE_33.333%)]">
        <NotificationDisplay />
        <div className="flex flex-row m-2 p-2 sm:max-w-4xl sm:w-full h-full sm:max-h-[80%] 2xl:-translate-x-1/4">
          <div className="w-[10px] min-h-full rounded-xl bg-[#A20ED3]" />
          <div className="p-5 w-full shadow-lg rounded-lg flex flex-col items-start justify-between bg-white">
            <div className="flex w-80">
              <Logo />
            </div>
            <div className="flex flex-col gap-y-6 items-start">
              <h2 className="text-3xl font-bold text-primary-dark">
                DEPOSIT BDI TOKEN
              </h2>
              <p className="text-gray-600 w-10/12">{content}</p>
              <ConnectWallet />
            </div>
            <div className="w-full flex flex-col gap-y-1 items-start">
              <Balance />
              {state.migratorOpenState === MigratorOpenState.Open && (
                <DepositButton max={BigNumber.from(state.balance)} />
              )}
              {state.migratorOpenState === MigratorOpenState.Closed && (
                <WithdrawButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dapp;
