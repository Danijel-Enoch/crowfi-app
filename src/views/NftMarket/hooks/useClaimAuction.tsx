import BigNumber from 'bignumber.js'
import { useNftMarketContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const useClaimAuction = (auctionId: string) => {
    const marketplaceContract = useNftMarketContract()

    const handleClaimAuction = useCallback(
        async() => {
            const gasPrice = getGasPrice()
            
            const tx = await callWithEstimateGas(marketplaceContract, 'collect', [auctionId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, auctionId]
    )

    const handleClaimBackAuction = useCallback(
        async() => {
            const gasPrice = getGasPrice()
            
            const tx = await callWithEstimateGas(marketplaceContract, 'getBackNFT', [auctionId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, auctionId]
    )

    return { onClaimAuction: handleClaimAuction, onClaimBackAuction: handleClaimBackAuction }
}