import { useCallback } from "react"
import BigNumber from "bignumber.js"
import { AddressZero } from '@ethersproject/constants'
import { getERC721TokenContract, getERC1155TokenContract, getERC165Contract, getNFTBundleContract } from "utils/contractHelpers"
import { NFTContractType } from "state/types"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import nftBundleAbi from 'config/abi/nftbundle.json'
import { getNFTBundleAddress, getNftMarketAddress } from "utils/addressHelpers"
import multicall from "utils/multicall"
import { Bundle, BundleItem, NFTMeta } from "./types"

const getBundleItemDetail  = async (library, chainId: number, contractAddress: string, contractType: NFTContractType, tokenId: number, amount: number) : Promise<BundleItem> => {
    let uri
    if (contractType === NFTContractType.ERC1155) {
        const nftContract = getERC1155TokenContract(contractAddress, library) as any
        uri = await nftContract.uri(tokenId)
        if (uri.includes('{id}')) {
            uri = uri.replace('{id}', tokenId)
        }
    } else {
        const nftContract = getERC721TokenContract(contractAddress, library) as any
        uri = await nftContract.tokenURI(tokenId)
    }

    const response = await fetch(uri)
    const meta: NFTMeta = await response.json()

    return {
        asset: {
            chainId,
            contractAddress,
            tokenId: tokenId.toString(),
            contractType,
            tokenUri: uri,
            mediaType: meta.properties?.type,
        },
        meta,
        amount
    }
}


const getBundleDetail  = async (chainId: number, contractAddress: string, tokenId, metaUri) : Promise<Bundle> => {

    const response = await fetch(metaUri)
    const meta: NFTMeta = await response.json()

    return {
        asset: {
            chainId,
            contractAddress,
            tokenId: tokenId.toString(),
            contractType: NFTContractType.BUNDLE,
            tokenUri: metaUri,
            mediaType: meta.properties?.type,
        },
        meta
    }
}

export const useGetBundles = () => {
    const { chainId } = useActiveWeb3React()

    const getBundles = useCallback(async(account: string) : Promise<Bundle[]> => {
        const bundleContractAddress = getNFTBundleAddress()
        const bundleContract = getNFTBundleContract(bundleContractAddress)
        const balance_ = await bundleContract.balanceOf(account)
        const balance = new BigNumber(balance_._hex).toNumber()
        const calls = [];
        for (let i = 0; i < balance; i ++) {
            calls.push({
                address:bundleContractAddress,
                name: 'tokenOfOwnerByIndex',
                params: [account, i]
            })
        }

        if (calls.length === 0) {
            return []
        }

        const tokenIds_ = await multicall(nftBundleAbi, calls)
        const tokenIds = tokenIds_.map((item) => new BigNumber(item[0]._hex).toString())

        const calls2 = tokenIds.map((tokenId) => {
            return {
                address:bundleContractAddress,
                name: 'tokenURI',
                params: [tokenId]
            }
        })

        const tokenUris_ = await multicall(nftBundleAbi, calls2)
        const tokenUris = tokenUris_.map((item) => item[0])

        const details = [];
        for (let i = 0; i < tokenIds.length; i ++) {
            details.push({
                id: tokenIds[i],
                uri: tokenUris[i]
            })
        }
        
        const data = await Promise.all(
            details.map(async (item) => {
                const res = await getBundleDetail(chainId, bundleContractAddress, item.id, item.uri)
                return res
            }),
        )
        return data
    }, [chainId])

    return { onGetBundles: getBundles }
}

export const useGetBundleItems = () => {
    const { library, chainId } = useActiveWeb3React()

    const getBundleItems = useCallback(async(contractAddress: string, bundleId: string) : Promise<BundleItem[]> => {
        const bundleContract = getNFTBundleContract(contractAddress)
        const {nfts, nftTypes, tokenIds, amounts} = await bundleContract.getItemsOfBundle(bundleId)
        const items = []
        for (let i = 0; i < nfts.length; i ++) {
            items.push({
                contractAddress: nfts[i],
                tokenId: new BigNumber(tokenIds[i]._hex).toNumber(),
                contractType: nftTypes[i],
                amount: new BigNumber(amounts[i]._hex).toNumber(),
            })
        }
        
        const data = await Promise.all(
            items.map(async (item) => {
                const res = await getBundleItemDetail(library, chainId, item.contractAddress, item.contractType, item.tokenId, item.amount)
                return res
            }),
        )
        return data
    }, [library, chainId])

    return { onGetBundleItems: getBundleItems }
}
