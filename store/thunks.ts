import { createAsyncThunk } from "@reduxjs/toolkit";
import { Jcr } from "abi/types/JCR";
import { BigNumber } from "ethers";

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
