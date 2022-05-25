import { Action, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppState, AppStateIn, setState } from "store/slice";
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

// analgous to useState in react hooks
export const useStoreState = (): [
  state: AppState,
  setStoreState: (newState: AppStateIn) => void
] => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const setStoreState = (newState: AppStateIn) =>
    dispatch(setState({ newState }));
  return [state, setStoreState];
};
