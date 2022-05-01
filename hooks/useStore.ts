import { Action, ThunkAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setBalance } from "store/slice";
import store from "../store";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useStoreBalance = (): [BigNumber | undefined, (b: string) => void] => {
    const balance = useAppSelector(state => state.balance);
    const dispatch = useAppDispatch()
    const storeSetBalance = useCallback(
        (balance: string) => dispatch(setBalance({ balance: balance.toString() }))
    , []);
    return [BigNumber.from(balance ?? 0), storeSetBalance]
}