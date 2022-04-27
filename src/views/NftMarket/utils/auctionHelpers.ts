import { AddressZero } from '@ethersproject/constants'
import { ContextData } from 'contexts/Localization/types';
import { Auction, NFTAuctionStatus } from "../hooks/types";

export const getAuctionStatus = (auction: Auction) => {
    if (auction.startedAt === 0) {
        return NFTAuctionStatus.NOT_RUNNING
    }
    if (auction.isTaken) {

        if (auction.lastBidder === AddressZero) {
            return NFTAuctionStatus.CANCELED
        }
        return NFTAuctionStatus.FINISHED
    }

    if (auction.startedAt + auction.duration > Math.floor(new Date().getTime() / 1000)) {
        return NFTAuctionStatus.RUNNING
    }

    if (auction.lastBidder === AddressZero) {
        return NFTAuctionStatus.FAILED
    }

    return NFTAuctionStatus.DEALED
}

export const getAuctionStatusText = (status: NFTAuctionStatus, t: (key: string, data?: ContextData) => string) => {

    let res = 'Not Running'
    switch (status) {
    case NFTAuctionStatus.NOT_RUNNING:
        res = t('Not Running')
        break
      case NFTAuctionStatus.FINISHED:
        res = t('Finished')
        break
    case NFTAuctionStatus.CANCELED:
        res = t('Canceled')
        break
    case NFTAuctionStatus.RUNNING:
        res = t('Ongoing')
        break
    case NFTAuctionStatus.DEALED:
        res = t('Dealed')
        break
    case NFTAuctionStatus.FAILED:
        res = t('Failed')
        break
    default: 
        res = t('Not Running')
        break
    }
    return res
}

export const getAuctionStatusColor = (status, theme) => {

    const res: {background: string, text: string} = {
        background: theme.colors.backgroundAlt,
        text: theme.colors.text
    }
    switch (status) {
    case NFTAuctionStatus.NOT_RUNNING:
        res.background = theme.colors.backgroundAlt
        break
    case NFTAuctionStatus.FINISHED:
        res.background = theme.colors.success
        res.text = 'white'
        break
    case NFTAuctionStatus.RUNNING:
        res.background = '#92c8f0'
        break
    case NFTAuctionStatus.DEALED:
        res.background = theme.colors.success
        res.text = 'white'
        break
    case NFTAuctionStatus.FAILED:
        res.background = theme.colors.failure
        res.text = 'white'
        break
    default: 
        res.background = theme.colors.backgroundAlt
        break
    }

    return res
}