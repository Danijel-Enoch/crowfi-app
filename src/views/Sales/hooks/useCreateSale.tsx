import { useCallback } from 'react'
import { useCrowpadSaleFactoryContract } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'
import BigNumber from 'bignumber.js'

export const useCreateSale = () => {
  const factory = useCrowpadSaleFactoryContract()

  const handleCreateSale = useCallback(
    async (feeAmount, wallet, token, rate, rateDecimals, listingRate, listingRateDecimals, liqudityPercent, goal, cap, openingTime, closingTime, unlockTime, minContribution, maxContribution, whitelistEnabled, logo) => {
      const gasPrice = getGasPrice()
      const args = [[rate, rateDecimals, listingRate, listingRateDecimals, liqudityPercent], wallet, ROUTER_ADDRESS, token, [goal, cap, minContribution, maxContribution, openingTime, closingTime, unlockTime], whitelistEnabled, logo];
      const tx = await callWithEstimateGas(factory, 'createSale', args, { gasPrice}, 1000, feeAmount)
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        /* eslint-disable dot-notation */
        const ev = Array.from(receipt["events"]).filter((v) =>  {
          return v["event"] === "NewSaleCreated"
        }); 

        if (ev.length > 0) {
          const resArgs = ev[0]["args"];

          return resArgs['deployed'];
        }
        /* eslint-enable dot-notation */
      }
      return null
    },
    [factory],
  )

  return { onCreateSale: handleCreateSale }
}