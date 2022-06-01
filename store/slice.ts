import {
  approvalSuccessNotification,
  depositSuccessNotification,
  errorNotification,
  infoNotification,
} from "@components/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { thunkApprove, thunkDeposit, thunkGetData } from "./thunks";

export enum MigratorOpenState {
  Open,
  Baking,
  Closed,
}

// alias to make it more obvious that this is a number in string repr
type BigNumberString = string;

export type AppState = {
  balance: BigNumberString;
  decimals: number;
  migratorOpenState: MigratorOpenState;
  totalDeposits: BigNumberString;
  approvalLimit: BigNumberString;
  userDeposits: BigNumberString;
  loading: boolean;
};

const appSlice = createSlice({
  name: "application",
  initialState: {
    balance: "0",
    decimals: 18,
    migratorOpenState: MigratorOpenState.Closed,
    totalDeposits: "0",
    approvalLimit: "0",
    userDeposits: "0",
    loading: false,
  } as AppState,

  extraReducers: (builder) => {
    builder.addCase(thunkDeposit.fulfilled, (state, action) => {
      state.loading = false;
      depositSuccessNotification();
      appSlice.caseReducers.setDeposit(state, {
        ...action,
        payload: {
          depositAmount: action.payload.depositAmount,
        },
      });
    });

    builder.addCase(thunkDeposit.pending, (state) => {
      state.loading = true;
      infoNotification("Deposit Request In Progress...");
    });

    builder.addCase(thunkDeposit.rejected, (state, action) => {
      state.loading = false;
      errorNotification(action.error.message ?? "Unknown Error");
    });

    builder.addCase(thunkApprove.fulfilled, (state) => {
      state.loading = false;
      appSlice.caseReducers.setApproval(state);
      approvalSuccessNotification();
    });

    builder.addCase(thunkApprove.pending, (state) => {
      state.loading = true;
      infoNotification("Approval Request In Progress...");
    });

    builder.addCase(thunkApprove.rejected, (state, action) => {
      state.loading = false;
      errorNotification(action.error.message ?? "Unknown Error");
    });

    builder.addCase(thunkGetData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetData.fulfilled, (state, action) => {
      appSlice.caseReducers.setState(state, {
        ...action,
        payload: {
          newState: {
            ...action.payload,
          },
        },
      });
      state.loading = false;
    });
  },

  reducers: {
    setState: (
      state,
      action: PayloadAction<{ newState: Omit<AppState, "loading"> }>
    ) => {
      state.approvalLimit = action.payload.newState.approvalLimit;
      state.balance = action.payload.newState.balance;
      state.decimals = action.payload.newState.decimals;
      state.migratorOpenState = action.payload.newState.migratorOpenState;
      state.totalDeposits = action.payload.newState.totalDeposits;
      state.userDeposits = action.payload.newState.userDeposits;
    },

    setDeposit: (state, action: PayloadAction<{ depositAmount: string }>) => {
      const [bnDeposit, bnBalance] = [
        action.payload.depositAmount,
        state.balance,
      ].map(BigNumber.from);
      const newBalanceBN = bnBalance.sub(bnDeposit);
      state.balance = newBalanceBN.toString();
    },

    setApproval: (state) => {
      state.approvalLimit = ethers.constants.MaxInt256.toString();
    },
  },
});

export const { setState, setDeposit } = appSlice.actions;

export default appSlice.reducer;
