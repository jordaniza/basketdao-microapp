import { useState } from "react";
import { useConnect } from "wagmi";
import { useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { thunkWithdraw } from "store/thunks";
import Button from "./button";

const WithdrawButton: React.FC = () => {
  const [state] = useStoreState();
  const [inProgress, setInProgress] = useState(false);
  const { isConnected } = useConnect();
  const migrator = useMigratorContract();
  const dispatch = useAppDispatch();

  const withdraw = () => {
    setInProgress(true);
    dispatch(thunkWithdraw({ migrator }))
      .then((res: { meta: { requestStatus: string } }) => {
        if (res.meta.requestStatus === "rejected") return;
      })
      .finally(() => setInProgress(false));
  };

  return (
    <div className="flex w-full">
      <Button
        disabled={state.loading || inProgress || !isConnected}
        onClick={() => withdraw()}
      >
        Withdraw
      </Button>
    </div>
  );
};

export default WithdrawButton;
