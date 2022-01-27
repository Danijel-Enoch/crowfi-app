import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import { useCrowpadSaleContract } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

export const useBuySale = (address: string) => {
  const saleContract = useCrowpadSaleContract(address)

  const handleBuy = useCallback(async (account: string, amount: string) => {

    const gasPrice = getGasPrice()
    const tx = await callWithEstimateGas(saleContract, 'buyTokens', [account], {gasPrice}, 1000, amount)
    const receipt = await tx.wait()
    return receipt.status
  }, [saleContract])

  return { onBuySale: handleBuy }
}

export const useClaimSale = (address: string) => {
  const saleContract = useCrowpadSaleContract(address)

  const handleClaim = useCallback(async (account: string) => {
    const gasPrice = getGasPrice()
    const tx = await callWithEstimateGas(saleContract, 'withdrawTokens', [account], {gasPrice})
    const receipt = await tx.wait()
    return receipt.status
  }, [saleContract])

  return { onClaimSale: handleClaim }
}

export const useFinalizeSale = (address: string) => {
  const saleContract = useCrowpadSaleContract(address)

  const handleFinalize = useCallback(async () => {
    const gasPrice = getGasPrice()
    const tx = await callWithEstimateGas(saleContract, 'finalize', [], {gasPrice})
    const receipt = await tx.wait()
    return receipt.status
  }, [saleContract])

  return { onFinalize: handleFinalize }
}