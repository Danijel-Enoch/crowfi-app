import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import { useLiquidityGeneratorTokenContract,} from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

export const useLPGeneratorTokenWhitelistAddress = (tokenAddress) => {
  const tokenContract = useLiquidityGeneratorTokenContract(tokenAddress)

  const handleAddToWhitelist = useCallback(
    async (address) => {
      const gasPrice = getGasPrice()
      const args = [address];
      const tx = await callWithEstimateGas(tokenContract, 'excludeFromFee', args, { gasPrice})
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [ tokenContract]
  )

  const handleRemoveFromWhitelist = useCallback(
    async (address) => {
      const gasPrice = getGasPrice()
      const args = [address];
      const tx = await callWithEstimateGas(tokenContract, 'includeInFee', args, { gasPrice})
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [ tokenContract]
  )

  return { onAddToWhitelist: handleAddToWhitelist, onRemoveFromWhitelist: handleRemoveFromWhitelist }
}

export const useLPGeneratorTokenFee = (tokenAddress) => {
  const tokenContract = useLiquidityGeneratorTokenContract(tokenAddress)

  const handleSetTaxFee = useCallback(
    async (taxFee) => {
      const gasPrice = getGasPrice()
      const args = [taxFee];
      const tx = await callWithEstimateGas(tokenContract, 'setTaxFeePercent', args, { gasPrice})
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [ tokenContract]
  )

  const handleSetLpFee = useCallback(
    async (lpFee) => {
      const gasPrice = getGasPrice()
      const args = [lpFee];
      const tx = await callWithEstimateGas(tokenContract, 'setLiquidityFeePercent', args, { gasPrice})
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [ tokenContract]
  )

  return {
    onSetTaxFee: handleSetTaxFee,
    onSetLpFee: handleSetLpFee,
  }
}