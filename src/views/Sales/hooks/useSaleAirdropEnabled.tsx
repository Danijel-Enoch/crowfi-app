import { useCrowpadSaleContract } from "hooks/useContract"
import { useCallback } from "react"
import { callWithEstimateGas } from "utils/calls"
import getGasPrice from "utils/getGasPrice"


export const useSaleAirdropEnabled = (address: string) => {
    const saleContract = useCrowpadSaleContract(address)
  
    const handleEnableAirdrop = useCallback(async (enabled: boolean) => {
      const gasPrice = getGasPrice()
      const tx = await callWithEstimateGas(saleContract, 'setAirdropEnabled', [enabled], {gasPrice})
      const receipt = await tx.wait()
      return receipt.status
    }, [saleContract])
  
    return { onEnableAirdrop: handleEnableAirdrop }
}