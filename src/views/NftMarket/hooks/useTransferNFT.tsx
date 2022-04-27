import BigNumber from 'bignumber.js'
import { useNftMarketContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const useTransferNFT = () => {
    const marketplaceContract = useNftMarketContract()

    const handleTransferNFT = useCallback(
        async(receipient: string, tokenAddress: string, tokenType: string, tokenId: string, amount: string) => {
            const gasPrice = getGasPrice()
            const tx = await callWithEstimateGas(marketplaceContract, 'transferNFT', [receipient, tokenType, tokenAddress, tokenId, amount], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract]
    )

    const handleAirdropNFT = useCallback(
        async(receipients: string[], tokenAddress: string, tokenType: string, tokenId: string, amount: string) => {
            const gasPrice = getGasPrice()
            const tx = await callWithEstimateGas(marketplaceContract, 'transferNFT', [receipients, tokenType, tokenAddress, tokenId, amount], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract]
    )

    return { onTransferNFT: handleTransferNFT, onAirdropNFT: handleAirdropNFT }
}