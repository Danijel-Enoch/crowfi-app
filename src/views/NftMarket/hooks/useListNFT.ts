import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import { AddressZero } from '@ethersproject/constants'
import { useNftMarketContract } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import tokens from 'config/constants/tokens'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { isAddress } from 'utils'
import { NFTContractType } from 'state/types'

export const useListNFTMarket = () => {
    const marketplaceContract = useNftMarketContract()

    const handleListMarket = useCallback(async (useToken: boolean, refId: string, tokenAddress: string, tokenType: string, tokenId: string, amount: string, price: string) => {
        const params = [
            refId, 
            isAddress(tokenAddress),
            tokenType,
            tokenId,
            amount,
            useToken ? tokens.usdc.address : AddressZero,
            price
        ]
        
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'listMarket', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
                return v["event"] === "MarketListed"
            });
      
            if (ev.length > 0) {
                const args = ev[0]["args"];
                return new BigNumber(args["id"]._hex).toJSON()
            }
            /* eslint-enable dot-notation */
        }
        return null
    }, [marketplaceContract])

  return { onListMarket: handleListMarket }
}

export const useListNFTAuction = () => {
    const marketplaceContract = useNftMarketContract()

    const handleListAuction = useCallback(async (useToken: boolean, refId: string, tokenAddress: string, tokenType: string, tokenId: string, amount: string, price,duration) => {
        const params = [
            useToken ? tokens.usdc.address : AddressZero,
            refId,
            tokenAddress,
            tokenType,
            tokenId,
            amount,
            price,
            duration
        ]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'list', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
                return v["event"] === "AuctionListed"
            });
      
            if (ev.length > 0) {
                const args = ev[0]["args"];
                return new BigNumber(args["id"]._hex).toJSON()
            }
            /* eslint-enable dot-notation */
        }
        return null
    }, [marketplaceContract])

  return { onListAuction: handleListAuction }
}

export const useCancelListing = () => {
    const marketplaceContract = useNftMarketContract()

    const handleCancelListing = useCallback(async (listingId: string) => {
        const params = [listingId]
        
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'cancelMarket', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        return receipt.transactionHash
    }, [marketplaceContract])

  return { onCancelListing: handleCancelListing }
}

export const useCancelAuction = () => {
    const marketplaceContract = useNftMarketContract()

    const handleCancelAuction = useCallback(async (auctionId: string) => {
        const params = [auctionId]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'cancelAuction', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        return receipt.transactionHash
    }, [marketplaceContract])

    return { onCancelAuction: handleCancelAuction }
}
