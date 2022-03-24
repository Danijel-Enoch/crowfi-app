import React, { useMemo } from 'react'
import { Flex, TradeIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ExpandablePanel from '../../components/ExpandablePanel'
import { Listing, Auction, NFTResponse } from '../../hooks/types'
import ActiveListingSection from './ActiveListingSection'

interface ActiveSaleSectionProps {
    nft?: NFTResponse
    account?: string
    sell?: Listing
    auction?: Auction
    reloadSale: () => void
}

const ActiveSaleSection: React.FC<ActiveSaleSectionProps> = ({account, nft, sell, auction, reloadSale}) => {

    const { t } = useTranslation()

    
    return (
        <></>
    )
}

export default ActiveSaleSection