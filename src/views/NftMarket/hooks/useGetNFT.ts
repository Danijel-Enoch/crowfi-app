import { useCallback } from "react"
import BigNumber from "bignumber.js"
import { AddressZero } from '@ethersproject/constants'
import { getERC721TokenContract, getERC1155TokenContract, getERC165Contract } from "utils/contractHelpers"
import { NFTContractType } from "state/types"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import nftMarketAbi from 'config/abi/nftMarket.json'
import { API_PROFILE } from "config/constants/endpoints"
import { BUNDLE_INTERFACE_ID, ERC1155_INTERFACE_ID, ERC721_INTERFACE_ID } from "config/constants/nft"
import { getNftMarketAddress } from "utils/addressHelpers"
import multicall from "utils/multicall"
import { useNftMarketContract } from "hooks/useContract"
import { ActivitiesAPIResponse, Auction, BalancesAPIResponse, BidsAPIResponse, Listing, NFTAPIResponse, NFTAsset, NFTCollection, NFTMeta, NFTsAPIResponse } from "./types"

export const useGetNFT = () => {
    const { library, chainId } = useActiveWeb3React()

    const getNFT = useCallback(async(contractAddress: string, assetId: string) : Promise<{asset: NFTAsset, meta: NFTMeta}> => {
        const ERC165Contract = getERC165Contract(contractAddress, library.getSigner()) as any
        const isERC1155 = await ERC165Contract.supportsInterface(ERC1155_INTERFACE_ID)
        const isERC721 = await ERC165Contract.supportsInterface(ERC721_INTERFACE_ID)
        const isBundle = await ERC165Contract.supportsInterface(BUNDLE_INTERFACE_ID)

        let uri
        let decentralized = true
        if (isERC1155) {
            const nftContract = getERC1155TokenContract(contractAddress, library.getSigner()) as any
            uri = await nftContract.uri(assetId)
            if (uri.includes('{id}')) {
                uri = uri.replace('{id}', assetId)
                decentralized = false
            }
        } else if (isERC721 || isBundle) {
            const nftContract = getERC721TokenContract(contractAddress, library.getSigner()) as any
            uri = await nftContract.tokenURI(assetId)
        } else {
            return {asset: undefined, meta: undefined}
        }
        const response = await fetch(uri)
        const meta: NFTMeta = await response.json()
        
        return {
            asset: {
                decentralized,
                chainId,
                contractAddress,
                tokenId: assetId,
                contractType: isBundle ? NFTContractType.BUNDLE : isERC1155 ? NFTContractType.ERC1155 :  NFTContractType.ERC721,
                tokenUri: uri,
                mediaType: meta.properties?.type,
            },
            meta
        }
    }, [library, chainId])

    return { onGetNFT: getNFT }
}

export const useGetNFTBalance = () => {
    const { library } = useActiveWeb3React()

    const getNFTBalance = useCallback(async(collectionAddress: string, assetId: string, tokenType: NFTContractType, account?: string) => {

        if (!account) {
            return 0
        }

        if (tokenType === NFTContractType.ERC721 || tokenType === NFTContractType.BUNDLE) {
            const nftContract = getERC721TokenContract(collectionAddress, library.getSigner()) as any
            const owner: string = await nftContract.ownerOf(assetId)
            if (owner.toLowerCase() === account?.toLowerCase()) {
                return 1
            }
            return 0
        }

        const nftContract = getERC1155TokenContract(collectionAddress, library.getSigner()) as any
        const res = await nftContract.balanceOf(account, assetId)
        return new BigNumber(res._hex).toNumber()

    }, [library])

    return { onGetNFTBalance: getNFTBalance }
}

export const useGetActiveSaleForNFT = () => {
    const marketContract = useNftMarketContract()
    const marketContractAddress = getNftMarketAddress()

    const getNFTAuction = useCallback(async(address: string, nftId: string) : Promise<Auction[]> => {
        try {
            const count_ = await marketContract.getTokenAuctionCount(address, nftId)
            const count = new BigNumber(count_._hex).toNumber()
            const calls: any[] = []
            for (let i = 0; i < count; i ++) {
                calls.push(
                    {
                        address: marketContractAddress,
                        name: 'nftAuctions',
                        params: [address, nftId, i.toString()],
                    },
                )
            }
            const auctionIds_ = await multicall(nftMarketAbi, calls)
            const auctionIds = auctionIds_.map((item) => new BigNumber(item).toString())
            const calls2 = auctionIds.map((item) => {
                return {
                    address: marketContractAddress,
                    name: 'auctions',
                    params: [item],
                }
            })
            
            const auctions = await multicall(nftMarketAbi, calls2)
            return auctions.map((item, index) => {
                const {
                    nft,
                    nftType,
                    tokenId,
                    amount,
                    payToken,
                    lastPrice,
                    raisedAmount,
                    duration,
                    startedAt,
                    isTaken,
                    seller,
                    lastBidder,
                } = item

                return {
                    id: auctionIds[index],
                    nft,
                    contractType: new BigNumber(nftType).toNumber(),
                    tokenId: new BigNumber(tokenId._hex),
                    amount: new BigNumber(amount._hex),
                    payToken,
                    useEth: payToken === AddressZero,
                    lastPrice: new BigNumber(lastPrice._hex),
                    raisedAmount: new BigNumber(raisedAmount._hex),
                    duration: new BigNumber(duration._hex).toNumber(),
                    startedAt: new BigNumber(startedAt._hex).toNumber(),
                    isTaken,
                    seller,
                    lastBidder
                }
            })
            return null
        } catch {
            return null
        }
    }, [marketContract, marketContractAddress])

    const getNFTSell = useCallback(async(address: string, nftId: string) : Promise<Listing[]> => {
        try {
            const count_ = await marketContract.getTokenMarketCount(address, nftId)
            const count = new BigNumber(count_._hex).toNumber()
            const calls: any[] = []
            for (let i = 0; i < count; i ++) {
                calls.push(
                    {
                        address: marketContractAddress,
                        name: 'nftMarkets',
                        params: [address, nftId, i.toString()],
                    },
                )
            }
            const marketIds_ = await multicall(nftMarketAbi, calls)
            const marketIds = marketIds_.map((item) => new BigNumber(item).toString())
            const calls2 = marketIds.map((item) => {
                return {
                    address: marketContractAddress,
                    name: 'markets',
                    params: [item],
                }
            })
            
            const markets = await multicall(nftMarketAbi, calls2)
            return markets.map((item, index) => {
                return {
                    id: marketIds[index],
                    nft: item.nft,
                    contractType: item.nftType,
                    tokenId: new BigNumber(item.tokenId._hex).toString(),
                    price: new BigNumber(item.price._hex),
                    amount: new BigNumber(item.amount._hex),
                    payToken: item.payToken,
                    useEth: item.payToken === AddressZero,
                    purchaser: item.purchaser,
                    seller: item.seller,
                    isSold: item.isSold
                }
            })
        } catch {
            return []
        }
    }, [marketContract, marketContractAddress])

    const getNFTOffer = useCallback(async(address: string, nftId: string) : Promise<Listing[]> => {
        try {
            const count_ = await marketContract.getTokenOfferCount(address, nftId)
            const count = new BigNumber(count_._hex).toNumber()
            const calls: any[] = []
            for (let i = 0; i < count; i ++) {
                calls.push(
                    {
                        address: marketContractAddress,
                        name: 'nftOffers',
                        params: [address, nftId, i.toString()],
                    },
                )
            }
            const offerIds_ = await multicall(nftMarketAbi, calls)
            const offerIds = offerIds_.map((item) => new BigNumber(item).toString())
            const calls2 = offerIds.map((item) => {
                return {
                    address: marketContractAddress,
                    name: 'offers',
                    params: [item],
                }
            })
            
            const markets = await multicall(nftMarketAbi, calls2)
            return markets.map((item, index) => {
                return {
                    id: offerIds[index],
                    nft: item.nft,
                    contractType: item.nftType,
                    tokenId: new BigNumber(item.tokenId._hex).toString(),
                    price: new BigNumber(item.price._hex),
                    amount: new BigNumber(item.amount._hex),
                    payToken: item.payToken,
                    useEth: item.payToken === AddressZero,
                    purchaser: item.purchaser,
                    seller: item.seller,
                    isSold: item.isSold
                }
            })
        } catch {
            return []
        }
    }, [marketContract, marketContractAddress])

    return { onGetNFTAuction: getNFTAuction, onGetNFTSell: getNFTSell, onGetNFTOffer: getNFTOffer }
}


export const getNftsWithQueryParams = async (params:any): Promise<NFTsAPIResponse> => {
    const url = new URL(`${API_PROFILE}/nfts`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url.toString())
    if (response.ok) {
      const res: NFTsAPIResponse = await response.json()
      return res
    }
    return {
        rows: [],
        count: 0
    }
}


export const findNft = async (contractAddress: string, tokenId: string, account?: string) => {
    const queryParams = account ? `?user=${account}` : ''
    const url = new URL(`${API_PROFILE}/nfts/${contractAddress}/${tokenId}${queryParams}`)
    const response = await fetch(url.toString())
    if (response.ok) {
      const res: NFTAPIResponse = await response.json()
      return res
    }
    return undefined
}



export const getNftOwners = async (id: number) => {
    const url = new URL(`${API_PROFILE}/nfts/${id}/owners`)
    const response = await fetch(url.toString())
    if (response.ok) {
      const res: BalancesAPIResponse = await response.json()
      return res.balances
    }
    return []
}
export const getNftBids = async (id: number) => {
    const url = new URL(`${API_PROFILE}/bids`)
    url.searchParams.append('nftId',id.toString())
    const response = await fetch(url.toString())
    if (response.ok) {
      const res: BidsAPIResponse = await response.json()
      return res.bids
    }
    return []
}
export const getNftActivities = async (id: number) => {
    const url = new URL(`${API_PROFILE}/activities`)
    url.searchParams.append('nftId',id.toString())
    const response = await fetch(url.toString())
    if (response.ok) {
      const res: ActivitiesAPIResponse = await response.json()
      return res
    }
    return {rows: [], count: 0}
}