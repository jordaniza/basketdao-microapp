import { errorNotification, infoNotification, successNotification } from "@components/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { thunkBurn } from "./thunks";

export type AppState = {
    balance?: string; // BN 
};

const appSlice = createSlice({
  name: 'application',
  initialState: {} as AppState,
  extraReducers: (builder) => {  

    builder.addCase(thunkBurn.fulfilled, (state, action) => {
      successNotification();
      appSlice.caseReducers.setBurn(state, { 
        ...action,
        payload: {
          burnAmount: action.payload.burnAmount
        }
      })
    })

    builder.addCase(thunkBurn.pending, () => {
      infoNotification()
    })

    builder.addCase(thunkBurn.rejected, (_, action) => {
      errorNotification(action.error.message ?? 'Unknown Error')
    })     
  },

  reducers: {
    setBalance: (state, action: PayloadAction<{ balance: string }>) => {
      state.balance = action.payload.balance.toString()
    },

    setBurn: (state, action: PayloadAction<{ burnAmount: string }>) => {
      const [bnBurn, bnBalance] = [action.payload.burnAmount, state.balance ?? 0].map(BigNumber.from);
      const newBalanceBN = bnBalance.sub(bnBurn)
      state.balance = newBalanceBN.toString();
    },
  }
})

export const {
  setBalance, setBurn
} = appSlice.actions

export default appSlice.reducer;