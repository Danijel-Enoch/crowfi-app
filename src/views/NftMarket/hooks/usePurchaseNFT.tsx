import BigNumber from 'bignumber.js'
import { useNftMarketContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const usePurchaseNFT = (listingId: string) => {
    const marketplaceContract = useNftMarketContract()

    const handlePurchaseNFT = useCallback(
        async(useEth: boolean, amount: BigNumber) => {
            const gasPrice = getGasPrice()
            if (useEth) {
                const tx = await callWithEstimateGas(marketplaceContract, 'purchase', [listingId], { gasPrice},1000, amount.toString())
                const receipt = await tx.wait()
                return receipt
            }
            
            const tx = await callWithEstimateGas(marketplaceContract, 'purchaseWithToken', [listingId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, listingId]
    )

    return { onPurchaseNFT: handlePurchaseNFT }
}