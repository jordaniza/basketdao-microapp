import Balance from "@components/balance";
import ConnectWallet from "@components/connectWallet";
import DepositButton from "@components/depositButton";
import WithdrawButton from "@components/withdrawButton";
import {
  chainSwitchNotification,
  NotificationDisplay,
} from "@components/notification";
import Content from "@components/content";
import { BigNumber } from "ethers";
import { useBDITokenContract, useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { thunkGetData } from "store/thunks";
import Logo from "public/logo.svg";
import { MigratorOpenState } from "../store/slice";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { ReminderDialog } from "@components/reminderDialog";

const useOnChainData = () => {
  const bdi = useBDITokenContract();
  const migrator = useMigratorContract();
  const dispatch = useAppDispatch();
  const { data: account } = useAccount();
  useEffect(() => {
    if (!account) return;
    dispatch(thunkGetData({ bdi, migrator, account: account.address }));
  }, [bdi, migrator, account, dispatch]);
};

const Dapp: NextPage = () => {
  const { switchNetwork, activeChain } = useNetwork({
    onError() {
      chainSwitchNotification();
    },
  });
  const [state] = useStoreState();
  const { isConnected } = useConnect();
  useOnChainData();

  useEffect(() => {
    if (switchNetwork && activeChain?.id !== 1) {
      switchNetwork(1);
    }
  }, [activeChain?.id, switchNetwork]);

  return (
    <>
      <Head>
        <title>Deposit BDI Tokens | PieDAO</title>
        <meta
          name="description"
          content="Migrate your BasketDAO's BDI token to  PieDAO's DeFi token."
        />
      </Head>
      <div className="w-screen h-screen justify-center items-center flex bg-[linear-gradient(90deg,_#FFFFFF_33.333%,_#6C5DFE_33.333%)]">
        <ReminderDialog />
        <NotificationDisplay />
        <div className="flex flex-row m-2 p-2 sm:max-w-4xl sm:w-full min-h-fit 2xl:-translate-x-1/4">
          <div className="w-[10px] min-h-full rounded-xl bg-[#A20ED3]" />
          <div className="p-5 w-full shadow-lg rounded-lg flex flex-col items-start justify-between bg-white gap-y-8">
            <div className="flex w-80">
              <Logo />
            </div>
            <div className="flex flex-col gap-y-6 items-start">
              <h2 className="text-3xl font-bold text-primary-dark">
                DEPOSIT BDI TOKEN
              </h2>
              <Content phase={!isConnected ? 0 : state.migratorOpenState} />
              <ConnectWallet />
            </div>
            {activeChain?.id === 1 ? (
              <div className="w-full flex flex-col gap-y-1 items-start">
                <Balance />
                {isConnected &&
                  state.migratorOpenState === MigratorOpenState.Open && (
                    <DepositButton max={BigNumber.from(state.balance)} />
                  )}
                {isConnected &&
                  state.migratorOpenState === MigratorOpenState.Closed && (
                    <WithdrawButton />
                  )}
              </div>
            ) : (
              isConnected && (
                <h2 className="text-xl font-bold text-primary-dark">
                  Please switch to Ethereum Mainnet.
                </h2>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dapp;
