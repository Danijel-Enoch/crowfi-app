import { useCallback } from 'react'
import { useLockerContract } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

export const useCreateLock = () => {
  const locker = useLockerContract()

  const handleCreatLock = useCallback(
    async (feeAmount, owner, tokenAddress, isLpToken, amount, unlockDate) => {
        const gasPrice = getGasPrice()
        const args = [owner, tokenAddress, isLpToken, amount, unlockDate];
        const tx = await callWithEstimateGas(locker, 'lock', args, { gasPrice}, 1000, feeAmount)
        const receipt = await tx.wait()
        return receipt.status
    },
    [locker],
  )

  return { onCreateLock: handleCreatLock }
}

export const useEditLock = () => {
  const locker = useLockerContract()

  const handleEditLock = useCallback(
    async (lockId, amount, unlockDate) => {
        const gasPrice = getGasPrice()
        const args = [lockId, amount, unlockDate];
        const tx = await callWithEstimateGas(locker, 'editLock', args, { gasPrice})
        const receipt = await tx.wait()
        return receipt
    },
    [locker],
  )

  return { onEditLock: handleEditLock }
}

export const useUnlock = () => {
  const locker = useLockerContract()

  const handleUnlock = useCallback(
    async (lockId) => {
        const gasPrice = getGasPrice()
        const args = [lockId];
        const tx = await callWithEstimateGas(locker, 'unlock', args, { gasPrice})
        const receipt = await tx.wait()
        return receipt
    },
    [locker],
  )

  return { onUnlock: handleUnlock }
}