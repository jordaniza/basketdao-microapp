import { createAsyncThunk } from "@reduxjs/toolkit";
import { Jcr } from "abi/types/JCR";

export type ThunkBurnProps = {
    burnAmount: string;
    jcr: Jcr | undefined
};

export const thunkBurn = createAsyncThunk(
    "app/burn",
    async (
      { burnAmount, jcr }: ThunkBurnProps,
      { rejectWithValue }
) => {
    if (!jcr) return rejectWithValue('Missing JCR Contract');
    const tx = await jcr.burn(burnAmount);
    const receipt = await tx.wait();
    return receipt.status === 1
        ? { burnAmount }
        : rejectWithValue("Burn Unsuccessful");
    }
);


export const thunkGetData = createAsyncThunk(
    'app/getData',
    async(
        { jcr, account }: { jcr?: Jcr, account?: string },
        { rejectWithValue }
    ) => {
        if (!jcr || !account) return rejectWithValue('Missing Required Parameters');
        // should multicall this
        const [balance, decimals] = await Promise.all([
            jcr.balanceOf(account),
            jcr.decimals()
        ]);
        return {
            balance, decimals
        }
    }
)