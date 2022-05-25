import { providers } from "@0xsequence/multicall";
import BasketMigratorAbi from "abi/json/basket-migrator.json";
import BdiAbi from "abi/json/bdi.json";
import { BasketMigrator } from "abi/types";
import { Bdi } from "abi/types/Bdi";
import { Contract, ContractInterface, ethers } from "ethers";
import { useMemo } from "react";
import { useProvider, useSigner } from "wagmi";
import { addresses } from "../constants";

const useMulticallProvider = () => {
  const provider = useProvider();
  return useMemo(() => new providers.MulticallProvider(provider), [provider]);
};

type MulticallEnabledContract<C extends Contract> = C & {
  provider: providers.MulticallProvider;
};

const useMulticallContractOrSigner = <C extends Contract>(
  address: string,
  abi: ContractInterface
): MulticallEnabledContract<C> => {
  const provider = useMulticallProvider();
  const { data: signer } = useSigner();
  const providerOrSigner = signer ?? provider;
  return useMemo(
    () =>
      new ethers.Contract(
        address,
        abi,
        providerOrSigner
      ) as MulticallEnabledContract<C>,
    [provider, signer, address, abi]
  );
};

export const useBDITokenContract = (): Bdi =>
  useMulticallContractOrSigner(addresses.contracts.BDI, BdiAbi);

export const useMigratorContract = (): BasketMigrator =>
  useMulticallContractOrSigner(
    addresses.contracts.BASKET_MIGRATOR,
    BasketMigratorAbi
  );
