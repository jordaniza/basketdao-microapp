import { useModalTools } from "hooks/useModalTools";
import { useReady } from "hooks/useReady";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Button from "./button";
import { TransitionDialog } from "./dialog";

const formatAccount = (account?: string): string =>
  account ? account.slice(0, 5) + "..." + account.slice(-5) : "ERROR";

const useAccountName = (isConnected = false): ((name: string) => string) => {
  const { data: account } = useAccount();

  return (name: string) =>
    isConnected ? formatAccount(account?.address) : `Connect ${name}`;
};

const ConnectWallet = () => {
  const {
    connect,
    isConnected,
    isConnecting,
    connectors,
    pendingConnector,
    activeConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const accountName = useAccountName(isConnected);
  const ready = useReady();
  const modalTools = useModalTools();

  return (
    <>
      <TransitionDialog title="Connect Wallet" modalTools={modalTools}>
        {ready && (
          <div className="flex flex-col w-full justify-evenly">
            {connectors.map((connector) => (
              <Button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => {
                  connect(connector);
                  modalTools.closeModal();
                }}
                className="my-1"
              >
                {connector.name}
                {!connector.ready && " (unsupported)"}
                {isConnecting &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </Button>
            ))}
          </div>
        )}
      </TransitionDialog>
      {ready && (
        <Button
          onClick={() => {
            isConnected ? disconnect() : modalTools.openModal();
          }}
        >
          {isConnecting
            ? "Connecting..."
            : accountName(activeConnector?.name ?? "")}
        </Button>
      )}
    </>
  );
};

export default ConnectWallet;
