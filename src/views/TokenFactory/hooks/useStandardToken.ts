import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import {  useStandardTokenContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import getGasPrice from 'utils/getGasPrice'

export const useBurnStandardToken = (tokenAddress) => {
  const { account } = useWeb3React()
  const tokenContract = useStandardTokenContract(tokenAddress)

  const handleBurnToken = useCallback(
    async (burnAmount) => {
      const gasPrice = getGasPrice()
      const args = [burnAmount];
      const tx = await callWithEstimateGas(tokenContract, 'burn', args, { gasPrice}, 1000, null, account)
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [ tokenContract, account]
  )

  return { onBurnToken: handleBurnToken }
}
