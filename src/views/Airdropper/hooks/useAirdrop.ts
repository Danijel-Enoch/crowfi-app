import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import { useAirdropperContract, useERC20, useTokenFactory } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import getGasPrice from 'utils/getGasPrice'
import { getBep20Contract } from 'utils/contractHelpers'

export const useAirdropTokeen = () => {
  const airdropContract = useAirdropperContract()

  const handleAirdropToken = useCallback(
    async (tokenAddress, receipts, amounts) => {

      const gasPrice = getGasPrice()

      const args = [tokenAddress, receipts, amounts];
      console.log('args', args);

      const tx = await callWithEstimateGas(airdropContract, 'airdropToken', args, { gasPrice})
      const receipt = await tx.wait()
      return receipt.transactionHash
    },
    [airdropContract],
  )

  return { onAirdropToken: handleAirdropToken }
}
