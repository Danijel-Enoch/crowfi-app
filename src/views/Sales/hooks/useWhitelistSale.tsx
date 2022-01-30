import { useCrowpadSaleContract } from "hooks/useContract"
import { useCallback } from "react"
import { callWithEstimateGas } from "utils/calls"
import getGasPrice from "utils/getGasPrice"


export const useSaleWhitelistEnabled = (address: string) => {
    const saleContract = useCrowpadSaleContract(address)
  
    const handleEnableWhitelist = useCallback(async (enabled: boolean) => {
      const gasPrice = getGasPrice()
      const tx = await callWithEstimateGas(saleContract, 'setWhitelistEnabled', [enabled], {gasPrice})
      const receipt = await tx.wait()
      return receipt.status
    }, [saleContract])
  
    return { onEnableWhitelist: handleEnableWhitelist }
}

export const useSaleWhitelist = (address: string) => {
    const saleContract = useCrowpadSaleContract(address)
  
    const handleAddWhitelist = useCallback(async (accounts) => {
      const gasPrice = getGasPrice()
      const tx = await callWithEstimateGas(saleContract, 'addWhitelistedAddresses', [accounts], {gasPrice})
      const receipt = await tx.wait()
      return receipt.status
    }, [saleContract])
  
    const handleRemoveWhitelist = useCallback(async (accounts) => {
      const gasPrice = getGasPrice()
      const tx = await callWithEstimateGas(saleContract, 'removeWhitelistedAddresses', [accounts], {gasPrice})
      const receipt = await tx.wait()
      return receipt.status
    }, [saleContract])
  
    return { onAddWhitelist: handleAddWhitelist, onRemoveWhitelist: handleRemoveWhitelist }
}