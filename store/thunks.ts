import { walletSubmittedNotification } from "@components/notification";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Bdi } from "abi/types";
import { BasketMigrator } from "abi/types/BasketMigrator";
import { ethers } from "ethers";
import { promiseObject } from "utils/promiseObject";
import { addresses } from "../constants";

export const THUNKS = {
  DEPOSIT: "app/deposit",
  APPROVE: "app/approve",
  GET_DATA: "app/getData",
  WITHDRAW: "app/withdraw",
};

export type ThunkDepositProps = {
  depositAmount: string;
  migrator: BasketMigrator | undefined;
};

export const thunkWithdraw = createAsyncThunk(
  THUNKS.WITHDRAW,
  async (
    { migrator }: { migrator: BasketMigrator | undefined },
    { rejectWithValue }
  ) => {
    if (!migrator) return rejectWithValue("Missing Migrator Contract");
    const tx = await migrator.exit();
    walletSubmittedNotification();
    const receipt = await tx.wait();
    return receipt.status === 1
      ? true
      : rejectWithValue("Withdraw Unsuccessful");
  }
);

export const thunkDeposit = createAsyncThunk(
  THUNKS.DEPOSIT,
  async (
    { depositAmount, migrator }: ThunkDepositProps,
    { rejectWithValue }
  ) => {
    if (!migrator) return rejectWithValue("Missing Migrator Contract");
    const tx = await migrator.enter(depositAmount);
    walletSubmittedNotification();
    const receipt = await tx.wait();
    return receipt.status === 1
      ? { depositAmount }
      : rejectWithValue("Deposit Unsuccessful");
  }
);

export type ThunkApproveProps = {
  bdi: Bdi;
};
export const thunkApprove = createAsyncThunk(
  THUNKS.APPROVE,
  async ({ bdi }: ThunkApproveProps, { rejectWithValue }) => {
    if (!bdi) return rejectWithValue("Missing BDI Contract");
    const tx = await bdi.approve(
      addresses.contracts.BASKET_MIGRATOR,
      ethers.constants.MaxUint256
    );
    walletSubmittedNotification();
    const receipt = await tx.wait();
    return receipt.status === 1
      ? true
      : rejectWithValue("Deposit Unsuccessful");
  }
);

type ThunkGetDataProps = {
  bdi?: Bdi;
  account?: string;
  migrator?: BasketMigrator;
};
export const thunkGetData = createAsyncThunk(
  THUNKS.GET_DATA,
  async (
    { bdi, account, migrator }: ThunkGetDataProps,
    { rejectWithValue }
  ) => {
    if (!bdi || !migrator) return rejectWithValue("Missing Required Contracts");

    const decimals = bdi.decimals();
    const migratorOpenState = migrator.state();
    const totalDeposits = migrator.totalDeposits();
    const userDeposits = account ? migrator.deposits(account) : 0;
    const balance = account ? bdi.balanceOf(account) : 0;
    const approvalLimit = account
      ? bdi.allowance(account, addresses.contracts.BASKET_MIGRATOR)
      : 0;

    const results = await promiseObject({
      decimals,
      migratorOpenState,
      totalDeposits,
      balance,
      approvalLimit,
      userDeposits,
    });

    return {
      approvalLimit: results.approvalLimit.toString(),
      decimals: results.decimals,
      balance: results.balance.toString(),
      totalDeposits: results.totalDeposits.toString(),
      migratorOpenState: results.migratorOpenState,
      userDeposits: results.userDeposits.toString(),
    };
  }
);
