import { useCallback } from "react"
import { IPFS_FILE_SERVER, IPFS_API_SERVER, API_PROFILE } from 'config/constants/endpoints'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { NFTAssetType, NFTContractType } from "state/types"
import getGasPrice from "utils/getGasPrice"
import { callWithEstimateGas } from "utils/calls"
import { getERC1155TokenContract, getERC721TokenContract } from "utils/contractHelpers"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useProfileTokenData } from "state/profile/hooks"
import BigNumber from "bignumber.js"
import { NFTResponse, NFTTrait } from "./types"

interface MintNFTResponse {
    nftId: string,
    tokenUri: string,
    thumbnail: string
}

export const useMintNFT = (account: string) => {

    const ipfsClinet = ipfsHttpClient({url:IPFS_API_SERVER})
    const { library } = useActiveWeb3React()

    const handleMintNFT = useCallback(async(collectionAddress: string, amount: number, assetFile: File, assetType: NFTAssetType, name: string, previewFile?: File, externalLink?: string, description?: string, attributes?: any) : Promise<MintNFTResponse | null> => {

        const added = await ipfsClinet.add(
            {
                path: assetFile.name,
                content: assetFile.stream()
            }
        )
        const assetUrl = `${IPFS_FILE_SERVER}${added.cid.toString()}`
        let imageUrl: string
        let animationUrl: string
        if (assetType === NFTAssetType.Image) {
            imageUrl = assetUrl
        } else {
            const previewAdded = await ipfsClinet.add(
                {
                    path: previewFile.name,
                    content: previewFile.stream()
                }
            )
            imageUrl = `${IPFS_FILE_SERVER}${previewAdded.cid.toString()}`
            animationUrl = assetUrl
        }
        const metadata: any = {}
        metadata.name = name
        metadata.image = imageUrl
        metadata.properties = {
            type: assetType,
            creator: account
        }
        if (attributes && attributes.length > 0) metadata.attributes = attributes
        if (description && description.length > 0) metadata.description = description
        if (externalLink && externalLink.length > 0) metadata.external_url = externalLink
        if (animationUrl && animationUrl.length > 0) metadata.animation_url = animationUrl

        const data = JSON.stringify(metadata)
        const dataAdded = await ipfsClinet.add(data)
        const metaUrl = `${IPFS_FILE_SERVER}${dataAdded.path}`

        const nftContract = getERC1155TokenContract(collectionAddress, library.getSigner())
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(nftContract, 'safeMint', [account, amount.toString()], { gasPrice})
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
              return v["event"] === "TransferSingle"
            });
    
            if (ev.length > 0) {
              const resArgs = ev[0]["args"];
    
              return {nftId: new BigNumber(resArgs['id']._hex).toString(), tokenUri: metaUrl, thumbnail: imageUrl};
            }
            /* eslint-enable dot-notation */
        }

        return null
    }, [account, ipfsClinet, library])

    return { onMintNFT: handleMintNFT }
}

export const useRegisterNFT = () => {
    const [tokenData] = useProfileTokenData()
    const { chainId } = useActiveWeb3React()
    const handleRegisterNFT = useCallback(async(
        name: string,
        collectionId: number,
        contractAddress: string,
        contractType: NFTContractType,
        tokenId: string,
        tokenUri: string,
        thumbnail: string,
        mediaType: NFTAssetType,
        supply: number,
        traits?: NFTTrait[]
    ) => {

        const params = {
            name,
            contractAddress,
            contractType,
            chainId,
            tokenId,
            tokenUri,
            thumbnail,
            mediaType,
            supply,
            traits
        }

        if (collectionId > 0) {
            /* eslint-disable dot-notation */
            params['collectionId'] = collectionId
            /* eslint-enable dot-notation */
        }

        const response = await fetch(`${API_PROFILE}/nfts`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.accessToken}`
            },
            body: JSON.stringify(params),
        })

        if (response.ok) {
            const data = await response.json()
            return data?.nft as NFTResponse
        }

        const error = await response.json()
        throw new Error(error?.message)
        
    }, [tokenData, chainId])
  
    return { onRegisterNFT: handleRegisterNFT }
  }
  
  