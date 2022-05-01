import { ActionReducerMapBuilder, AsyncThunk, AsyncThunkAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { thunkBurn, ThunkBurnProps } from "./thunks";

export type NotificationType = 'SUCCESS' | 'ERROR' | 'PENDING';

export type Notification = {
    message: string;
    timeout: number | null;
    type: NotificationType
};

/**
 * Application-wide state, handling notifications and also a cached chain id to reduce network calls
 */
export type AppState = {
    balance?: string; // BN 
    notifications: Notification[] | [];
};

/**
 * DRY utility function to attach user-friendly notification on Success/Pending/Error
 * The error handler will also log the specific error to the console for the developer
 * @param builder pass the builder exposed as the first arg of the extraReducers function
 * @param thunk import a thunk created with RTK's createAsyncThunk
 */
const addTxNotifications = <P extends string>(
  builder: ActionReducerMapBuilder<AppState>,
  // We could narrow the typedefs from any, but this adds substantial boilerplate
  // for a very simple set of functions that don't rely heavily on type inference
  thunk: AsyncThunk<any, any, {}>
) => {
    builder.addCase(thunk.fulfilled, (state, action) => {
      console.debug({action})
      state.notifications = [
          ...state.notifications,
            {
                message: action.payload ?? 'Transaction Successful',
                type: 'SUCCESS',
                timeout: 5000,
            }
        ]
    })
    builder.addCase(thunk.pending, (state) => {
      state.notifications = [
          ...state.notifications,
            { 
                message: 'Transaction Pending',
                type: 'PENDING',
                timeout: null,
            }
        ]
    })
    builder.addCase(thunk.rejected, (state, action) => {
      // log the actual error here
      console.error(action.error);
      state.notifications = [
          ...state.notifications,
        {
            message: action.error.message ?? 'Transaction Failed',
            type: 'ERROR',
            timeout: 5000,
        }
      ]
    })   
}

const appSlice = createSlice({
  name: 'application',
  initialState: {} as AppState,
  extraReducers: (builder) => {  
    // addTxNotifications(builder, thunkBurn);

    builder.addCase(thunkBurn.fulfilled, (state, action) => {
      console.debug({ action })
      appSlice.caseReducers.setBurn(state, { 
        ...action,
        payload: {
          burnAmount: action.payload.burnAmount
        }
      })
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