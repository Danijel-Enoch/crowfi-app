import { useCallback } from 'react'
import { useCrowpadSaleFactoryContract, useERC20 } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

export const useDepositeSale = (token: string) => {
  const tokenContract = useERC20(token)

  const handleDeposite = useCallback(
    async (amount, sale) => {
        const gasPrice = getGasPrice()
        const args = [sale, amount];
        const tx = await callWithEstimateGas(tokenContract, 'transfer', args, { gasPrice})
        const receipt = await tx.wait()
        return receipt
    },
    [tokenContract],
  )

  return { onDeposite: handleDeposite }
}