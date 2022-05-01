import { BigNumber, ethers } from "ethers";
import { useDecimals, useJCRContract } from "hooks/useContract";
import { useAppDispatch } from "hooks/useStore";
import { ChangeEvent, useState } from "react";
import { thunkBurn } from "store/thunks";
import { useConnect } from "wagmi";
import Button from "./button";
import { metamaskSubmittedNotification } from "./notification";

const BurnButton: React.FC<{ max: BigNumber }> = ({ max }) => {
    const [burnAmount, setBurnAmount] = useState<BigNumber>(max);
    const dispatch = useAppDispatch();
    const { decimals, isLoading } = useDecimals();
    const [burning, setBurning] = useState(false);
    const JCRContract = useJCRContract();
    const { isConnected } = useConnect();

    const burn = (amount: BigNumber) => {
        setBurning(true);
        dispatch(
            thunkBurn({ burnAmount: amount.toString(), jcr: JCRContract })
        )
        .then(() => {
            setBurnAmount(BigNumber.from(0))
            metamaskSubmittedNotification();
        })
        .finally(() => setBurning(false))
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { valueAsNumber } = event.target;                        
        const inputValue = Number.isNaN(valueAsNumber) ? 0 : Math.round(valueAsNumber)
        const multiplier = BigNumber.from(10).pow(decimals ?? 18);
        const raw = BigNumber.from(inputValue).mul(multiplier) 
        const bounded = raw.gt(max) ? max : raw 
        setBurnAmount(bounded)
    };


    return (
        <div className="flex flex-wrap justify-center w-full">
            <div className="border-4 border-white bg-purple-50 shadow-md text-xl rounded-lg px-3 py-2 mx-2 w-1/2 flex justify-between text-gray-600">
                <input
                    className="w-11/12 bg-transparent "
                    type="number"
                    value={parseInt(ethers.utils.formatUnits(burnAmount, decimals)).toString()}
                    onChange={onChange}
                    min={0}
                    step={1}
                    max={parseInt(ethers.utils.formatUnits(max, decimals))}
                />
                <button
                    onClick={() => setBurnAmount(max)}
                >Max</button>
            </div>
            <Button
                disabled={isLoading || burning || !isConnected || burnAmount.eq(0)}
                onClick={() => burn(burnAmount)}
            >Burn</Button>
        </div>
    )
}

export default BurnButton