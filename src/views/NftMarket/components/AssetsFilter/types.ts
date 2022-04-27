import { NFTAssetType } from "state/types"
import { NFTCollection } from "views/NftMarket/hooks/types"

export interface AssetStatusFilter {
    buyNow: boolean
    minted: boolean
    onAuction: boolean
    hasOffer: boolean
}

export interface AssetArtTypeFilter {
    image: boolean
    video: boolean
    audio: boolean
}

export interface AssetPriceFilter {
    min: number
    max: number
    eth?: boolean
}

export interface AssetFilter {
    status: string[]
    type: string[]
    collections?: Map<number, NFTCollection>,
    priceFilter?: AssetPriceFilter
}

export const createFilterFrom = (
    statusFilter?: AssetStatusFilter,
    artTypeFilter?: AssetArtTypeFilter,
    collections?: Map<number, NFTCollection>,
    priceFilter?: AssetPriceFilter
) => {
    const status: string[] = []
    if (statusFilter.buyNow) status.push('buy_now')
    if (statusFilter.minted) status.push('minted')
    if (statusFilter.onAuction) status.push('auction')
    if (statusFilter.hasOffer) status.push('offer')

    const type: string[] = []
    if (artTypeFilter.image) status.push(NFTAssetType.Image)
    if (artTypeFilter.video) status.push(NFTAssetType.Video)
    if (artTypeFilter.audio) status.push(NFTAssetType.Audio)

    return {
        status,
        type,
        collections,
        priceFilter
    }
}