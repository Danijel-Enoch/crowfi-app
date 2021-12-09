import { useCallback } from 'react'
import { buySale } from 'utils/calls'
import { usePrivateSaleManager } from 'hooks/useContract'

const useBuySale = (managerAddress: string) => {
  const pvSaleMgr = usePrivateSaleManager(managerAddress)

  const handleBuy = useCallback(async (amount: string) => {
    await buySale(pvSaleMgr, amount)
  }, [pvSaleMgr])

  return { onBuy: handleBuy }
}

export default useBuySale
