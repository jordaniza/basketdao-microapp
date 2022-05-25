import { JsonRpcProvider } from "@ethersproject/providers";
import { InjectedConnector } from "@wagmi/core";
import { ethers } from "ethers";

export const injected = new InjectedConnector();

export const RPC = {
  MAINNET: "https://rpc.ankr.com/eth",
  LOCAL: "http://127.0.0.1:8545",
};

export const providers = Object.entries(RPC).reduce(
  (prev, [key, rpc]) => ({
    ...prev,
    [key]: new ethers.providers.JsonRpcProvider(rpc),
  }),
  {} as Record<keyof typeof RPC, JsonRpcProvider>
);
