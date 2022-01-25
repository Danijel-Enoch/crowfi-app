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
