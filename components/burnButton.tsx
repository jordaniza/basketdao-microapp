import { BigNumber, ethers } from "ethers";
import { useDecimals, useJCRContract } from "hooks/useContract";
import { useAppDispatch } from "hooks/useStore";
import { ChangeEvent, useState } from "react";
import { thunkBurn } from "store/thunks";

const BurnButton: React.FC<{ max: BigNumber }> = ({ max }) => {
    const [burnAmount, setBurnAmount] = useState<BigNumber>(max);
    const dispatch = useAppDispatch();
    const { decimals, isLoading } = useDecimals();
    const [burning, setBurning] = useState(false);
    const JCRContract = useJCRContract();

    const burn = async (amount: BigNumber) => {
        setBurning(true);
        await dispatch(thunkBurn({ burnAmount: amount.toString(), jcr: JCRContract }));
        setBurning(false);
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
            <div className="border-2 border-green-900 rounded-md p-2 mx-2 w-1/2 flex justify-between">
                <input
                    className="w-11/12"
                    type="number"
                    value={parseInt(ethers.utils.formatUnits(burnAmount, decimals))}
                    onChange={onChange}
                    min={0}
                    step={1}
                    max={parseInt(ethers.utils.formatUnits(max, decimals))}
                />
                <button
                    onClick={() => setBurnAmount(max)}
                >Max</button>
            </div>
            <button
                className="px-5 py-1 rounded-md shadow-sm bg-green-700 text-white"
                disabled={isLoading || burning}
                onClick={() => burn(burnAmount)}
            >Burn</button>
        </div>
    )
}

export default BurnButton