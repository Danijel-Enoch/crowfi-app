import { useCallback } from 'react'
import { claimSale } from 'utils/calls'
import { usePrivateSaleManager } from 'hooks/useContract'


const useClaimSale = (managerAddress: string) => {
  const pvSaleMgr = usePrivateSaleManager(managerAddress)

  const handleClaim = useCallback(async (amount: string) => {
    await claimSale(pvSaleMgr, amount)
  }, [pvSaleMgr])

  return { onClaim: handleClaim }
}

export default useClaimSale
