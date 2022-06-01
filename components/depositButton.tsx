import { BigNumber, ethers } from "ethers";
import { useBDITokenContract, useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { ChangeEvent, useEffect, useState } from "react";
import { thunkApprove, thunkDeposit, thunkGetData } from "store/thunks";
import { useAccount, useConnect } from "wagmi";
import Button from "./button";

const DepositButton: React.FC<{ max: BigNumber }> = ({ max }) => {
  const [depositAmount, setDepositAmount] = useState<BigNumber>(max);
  const [isApproved, setIsApproved] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const dispatch = useAppDispatch();
  const migrator = useMigratorContract();
  const bdi = useBDITokenContract();
  const [state] = useStoreState();
  const { isConnected } = useConnect();
  const { data: account } = useAccount();

  useEffect(() => {
    setIsApproved(BigNumber.from(state.approvalLimit).gte(depositAmount));
  }, [depositAmount, state.approvalLimit]);

  const approve = () => {
    setInProgress(true);
    dispatch(thunkApprove({ bdi }))
      .then((res) => {
        if (res.meta.requestStatus === "rejected") return;
        setIsApproved(true);
      })
      .finally(() => setInProgress(false));
  };

  const deposit = (amount: BigNumber) => {
    setInProgress(true);
    dispatch(thunkDeposit({ depositAmount: amount.toString(), migrator }))
      .then((res) => {
        if (res.meta.requestStatus === "rejected") return;
        setDepositAmount(BigNumber.from(0));
      })
      .finally(() => {
        setInProgress(false);
        dispatch(thunkGetData({ bdi, migrator, account: account?.address }));
      });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { valueAsNumber } = event.target;
    const inputValue = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
    const raw = ethers.utils.parseUnits(inputValue.toString(), state.decimals);
    const bounded = raw.gt(max) ? max : raw;
    setDepositAmount(bounded);
  };

  return (
    <div className="flex gap-x-4 w-full">
      <div className="border-4 border-white shadow-sm text-xl rounded-lg px-3 py-2 w-2/3 flex justify-between text-gray-600">
        <input
          className="w-full bg-transparent focus:outline-none color-main-typography font-bold text-3xl appearance-none"
          type="number"
          value={ethers.utils.formatUnits(depositAmount, state.decimals)}
          onChange={onChange}
          min={0}
          max={ethers.utils.formatUnits(max, state.decimals)}
        />
        <button className="px-1 ml-auto" onClick={() => setDepositAmount(max)}>
          Max
        </button>
      </div>
      <Button
        disabled={
          state.loading || inProgress || !isConnected || depositAmount.eq(0)
        }
        onClick={() => (isApproved ? deposit(depositAmount) : approve())}
      >
        {isApproved ? "Deposit" : "Approve"}
      </Button>
    </div>
  );
};

export default DepositButton;
