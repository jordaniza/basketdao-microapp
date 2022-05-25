import { BigNumber, ethers } from "ethers";
import { useBDITokenContract, useMigratorContract } from "hooks/useContract";
import { useAppDispatch, useStoreState } from "hooks/useStore";
import { ChangeEvent, useEffect, useState } from "react";
import { thunkApprove, thunkDeposit } from "store/thunks";
import { useConnect } from "wagmi";
import Button from "./button";

const DepositButton: React.FC<{ max: BigNumber }> = ({ max }) => {
  const [depositAmount, setDepositAmount] = useState<BigNumber>(max);
  const [isApproved, setIsApproved] = useState(false);
  const dispatch = useAppDispatch();
  const [inProgress, setInProgress] = useState(false);
  const migrator = useMigratorContract();
  const bdi = useBDITokenContract();
  const [state] = useStoreState();
  const { isConnected } = useConnect();

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

  const burn = (amount: BigNumber) => {
    setInProgress(true);
    dispatch(thunkDeposit({ depositAmount: amount.toString(), migrator }))
      .then((res) => {
        if (res.meta.requestStatus === "rejected") return;
        setDepositAmount(BigNumber.from(0));
      })
      .finally(() => setInProgress(false));
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { valueAsNumber } = event.target;
    const inputValue = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
    const raw = ethers.utils.parseUnits(inputValue.toString(), state.decimals);
    const bounded = raw.gt(max) ? max : raw;
    setDepositAmount(bounded);
  };

  return (
    <div className="flex flex-wrap justify-center w-full">
      <div className="border-4 border-white bg-purple-50 shadow-md text-xl rounded-lg px-3 py-2 mx-2 w-1/2 flex justify-between text-gray-600">
        <input
          className="w-11/12 bg-transparent focus:outline-none"
          type="number"
          value={ethers.utils.formatUnits(depositAmount, state.decimals)}
          onChange={onChange}
          min={0}
          max={ethers.utils.formatUnits(max, state.decimals)}
        />
        <button className="px-1 ml-2" onClick={() => setDepositAmount(max)}>
          Max
        </button>
      </div>
      <Button
        disabled={
          state.loading || inProgress || !isConnected || depositAmount.eq(0)
        }
        onClick={() => (isApproved ? burn(depositAmount) : approve())}
      >
        {isApproved ? "Deposit" : "Approve"}
      </Button>
    </div>
  );
};

export default DepositButton;
