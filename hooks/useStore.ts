import { setState } from "store/slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// analgous to useState in react hooks
export const useStoreState = (): [
  state: RootState,
  setStoreState: (newState: RootState) => void
] => {
  const dispatch = useAppDispatch();
  const state: RootState = useAppSelector((state) => state.reducer);
  const setStoreState = (newState: Omit<RootState, "loading">) =>
    dispatch(setState({ newState }));
  return [state, setStoreState];
};
