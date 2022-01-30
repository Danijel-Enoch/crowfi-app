import { useCallback } from 'react'
import { useCrowpadSaleFactoryContract } from 'hooks/useContract'
import { ROUTER_ADDRESS } from 'config/constants'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'
import BigNumber from 'bignumber.js'

export const useCreateSale = () => {
  const factory = useCrowpadSaleFactoryContract()

  const handleCreateSale = useCallback(
    async (feeAmount, wallet, token, rate, goal, cap, openingTime, closingTime, minContribution, maxContribution, whitelistEnabled, useEscrow, logo) => {
      const gasPrice = getGasPrice()
      const args = [rate, wallet, token, [goal, cap], [minContribution, maxContribution], [openingTime, closingTime], whitelistEnabled, new BigNumber(useEscrow ? 1 : 0).toString(), logo];
      const tx = await callWithEstimateGas(factory, 'createSale', args, { gasPrice}, 1000, feeAmount)
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        /* eslint-disable dot-notation */
        const ev = Array.from(receipt["events"]).filter((v) =>  {
          return v["event"] === "NewSaleCreated"
        }); 

        console.log('events', ev)

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