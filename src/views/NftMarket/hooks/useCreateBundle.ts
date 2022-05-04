import { useCallback } from "react"
import { IPFS_FILE_SERVER, IPFS_API_SERVER, API_PROFILE } from 'config/constants/endpoints'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { NFTAssetType, NFTContractType } from "state/types"
import getGasPrice from "utils/getGasPrice"
import { callWithEstimateGas } from "utils/calls"
import { getNFTBundleContract } from "utils/contractHelpers"
import { getNFTBundleAddress } from "utils/addressHelpers"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import BigNumber from "bignumber.js"

interface MintNFTResponse {
    contractAddress: string,
    nftId: string,
    tokenUri: string,
    thumbnail: string
}

export const useAddNftToBundle = () => {
    const { library } = useActiveWeb3React()
    const handleAddToBundle = useCallback(async (bundleAddress: string, bundleId: string, nftAddress: string, nftType: NFTContractType, nftTokenId: string, nftAmount: string|number) => {
        const bundleContract = getNFTBundleContract(bundleAddress, library.getSigner())

        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(bundleContract, 'addToken', [bundleId, nftAddress, nftType, nftTokenId, nftAmount], { gasPrice})    
        const receipt = await tx.wait()
        return receipt
    }, [library])
    return {onAddNftToBundle: handleAddToBundle}
}

export const useMintBundle = (account: string) => {

    const ipfsClinet = ipfsHttpClient({url:IPFS_API_SERVER})
    const { library } = useActiveWeb3React()

    const handleMintBundle = useCallback(async(nftAddresses: string[], nftTypes: NFTContractType[], nftTokenIds: string[], amounts: number[], assetFile: File, assetType: NFTAssetType, name: string, previewFile?: File, description?: string, attributes?: any) : Promise<MintNFTResponse | null> => {

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
        if (animationUrl && animationUrl.length > 0) metadata.animation_url = animationUrl

        const data = JSON.stringify(metadata)
        const dataAdded = await ipfsClinet.add(data)
        const metaUrl = `${IPFS_FILE_SERVER}${dataAdded.path}`

        const nftBundleAddress = getNFTBundleAddress()

        const nftContract = getNFTBundleContract(nftBundleAddress, library.getSigner())
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(nftContract, 'safeMint', [account, metaUrl, nftAddresses, nftTypes, nftTokenIds, amounts], { gasPrice})
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
              return v["event"] === "Packed"
            });
    
            if (ev.length > 0) {
              const resArgs = ev[0]["args"];
    
              return {contractAddress: nftBundleAddress, nftId: new BigNumber(resArgs['bundleId']._hex).toString(), tokenUri: metaUrl, thumbnail: imageUrl};
            }
            /* eslint-enable dot-notation */
        }

        return null
    }, [account, ipfsClinet, library])

    return { onMintBundle: handleMintBundle }
}

export const useUnpackBundle = () => {
    const { library } = useActiveWeb3React()

    const handleUnpackBundle = useCallback(async(bundleAddress: string, bundleId: string|number) => {

        const nftContract = getNFTBundleContract(bundleAddress, library.getSigner())
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(nftContract, 'unpack', [bundleId], { gasPrice})
        const receipt = await tx.wait()

        return receipt.transactionHash
    }, [library])

    return { onUnpackBundle: handleUnpackBundle }
}