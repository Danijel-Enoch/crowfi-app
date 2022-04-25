import BigNumber from 'bignumber.js'
import { useNftMarketContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const useAcceptOffer = (listingId: string) => {
    const marketplaceContract = useNftMarketContract()

    const handleAcceptOffer = useCallback(
        async() => {
            const gasPrice = getGasPrice()
            
            const tx = await callWithEstimateGas(marketplaceContract, 'acceptOffer', [listingId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, listingId]
    )

    return { onAcceptOffer: handleAcceptOffer }
}