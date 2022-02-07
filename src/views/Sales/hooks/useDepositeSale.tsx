import { useCallback } from 'react'
import { useCrowpadSaleContract, useCrowpadSaleFactoryContract, useERC20 } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

export const useDepositeSale = (address: string) => {
  const saleContract = useCrowpadSaleContract(address)

  const handleDeposite = useCallback(
    async () => {
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(saleContract, 'deposit', [], { gasPrice})
        const receipt = await tx.wait()
        return receipt
    },
    [saleContract],
  )

  return { onDeposite: handleDeposite }
}

export const useCancelSale = (address: string) => {
  const saleContract = useCrowpadSaleContract(address)

  const handleCancel = useCallback(async () => {
    const gasPrice = getGasPrice()
    const tx = await callWithEstimateGas(saleContract, 'cancel', [], {gasPrice})
    const receipt = await tx.wait()
    return receipt.status
  }, [saleContract])

  return { onCancel: handleCancel }
}