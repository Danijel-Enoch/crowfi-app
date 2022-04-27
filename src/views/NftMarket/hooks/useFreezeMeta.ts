import { useCallback } from "react"
import { IPFS_FILE_SERVER, IPFS_API_SERVER, API_PROFILE } from 'config/constants/endpoints'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import getGasPrice from "utils/getGasPrice"
import { callWithEstimateGas } from "utils/calls"
import { getERC1155TokenContract } from "utils/contractHelpers"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { NFTAsset, NFTMeta } from "./types"

export const useFreezeMetadata = () => {

    const ipfsClinet = ipfsHttpClient({url:IPFS_API_SERVER})
    const handleUploadMeta = useCallback(async(meta: NFTMeta) => {
        const data = JSON.stringify(meta)
        const dataAdded = await ipfsClinet.add(data)
        const metaUrl = `${IPFS_FILE_SERVER}${dataAdded.path}`
        return metaUrl
    }, [ipfsClinet])

    const { library } = useActiveWeb3React()

    const handleSetTokenURI = useCallback(async (asset: NFTAsset, uri: string) => {
        const nftContract = getERC1155TokenContract(asset.contractAddress, library.getSigner())

        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(nftContract, 'setTokenURI', [asset.tokenId, uri], { gasPrice})    
        const receipt = await tx.wait()
        return receipt
    }, [library])

    return {
        onUploadMeta: handleUploadMeta,
        onSetTokenURI: handleSetTokenURI
    }

}