import React, { useMemo } from 'react'
import { Book, List, Tag } from 'react-feather'
import { format } from 'date-fns'
import styled from 'styled-components'
import { ChartIcon, Flex, SellIcon, Text, useMatchBreakpoints, LinkExternal } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useTheme from 'hooks/useTheme'
import ExpandablePanel from '../../components/ExpandablePanel'
import { BidResponse, NFTMeta } from '../../hooks/types'

const Cell = styled(Flex)`

`
export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  padding: 4px 0px;


  grid-template-columns: 20px repeat(5, 1fr);

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(4, 1fr);
    & :nth-child(1) {
      display: none;
    }
    & :nth-child(2) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 20px repeat(5, 1fr);
    & :nth-child(1) {
      display: block;
    }
    & :nth-child(2) {
      display: block;
    }
    & :nth-child(3) {
      display: block;
    }
    & :nth-child(4) {
      display: block;
    }
    & :first-child {
      display: block;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 20px repeat(4, 1fr);
    & :nth-child(3) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {

    grid-template-columns: 20px repeat(5, 1fr);
    & :nth-child(3) {
      display: block;
    }
  }
`
const DataRow: React.FC<{ 
    bid: BidResponse; 
    index: number, 
    account?: string, 
}> = ({ bid, index, account }) => {
    const { t } = useTranslation()

    const isBidder = useMemo(() => {
        return bid.bidder.address?.toLowerCase() === account.toLowerCase()
    }, [account, bid])

    const statusText = useMemo(() => {
        if (!bid.auction.lastBidderId)
            return 'Out'

        if (bid.auction?.lastBidderId === bid.bidderId && bid.priceRaw === bid.auction?.lastPriceRaw) {
            if (bid.auction?.endAt > new Date().getTime() / 1000) {
                return '-'
            }
            return 'In'
        }

        return 'Out'
    }, [bid])
    return (
        <ResponsiveGrid>
            <Cell>
                <Text>{index}</Text>
            </Cell>
            <Cell>
                <Text>{bid.auction?.auctionId}</Text>
            </Cell>
            <Cell>
                <LinkExternal href={getBscScanLink(bid.bidder?.address, 'address')} fontSize="14px">
                    {isBidder ? 'You' : truncateHash(bid.bidder?.address)}
                </LinkExternal>
            </Cell>
            <Flex alignItems="center">
                <Text>{format(bid.creationTime * 1000, 'MM/dd/yy h:mm a')}</Text>
            </Flex>
            <Cell>
                <Text fontSize="14px" fontWeight={400}>{bid.price}</Text>
            </Cell>
            <Cell>
                <Text>
                {statusText}
                </Text>
            </Cell>
        </ResponsiveGrid>
    )
}

interface OffersSectionProps {
    metadata: NFTMeta
    bids?: BidResponse[]
    account?: string
}

const OffersSection: React.FC<OffersSectionProps> = ({metadata, bids, account}) => {

    const { t } = useTranslation()

    const assetUrl = useMemo(() => {
        if (metadata.properties?.type === NFTAssetType.Image) {
            return metadata.image
        }

        return metadata.animation_url

    }, [metadata])

    
    return (
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                icon={<List/>}
                title={t('Offers')}
            >
                <Flex flexDirection="column" margin="12px">
                    {bids && bids.length > 0 ? (
                        <Flex flexDirection="column">
                            <ResponsiveGrid>
                                <Text color="secondary" fontSize="12px" bold>
                                #
                                </Text>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Auction')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Bidder')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Date')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Price')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Status')}
                                </ClickableColumnHeader>
                            </ResponsiveGrid>

                            <Break />
                            {bids && bids.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <DataRow index={index} bid={item} account={account}/>
                                        <Break />
                                    </React.Fragment>
                                )
                            })}
                        </Flex>
                    ) : (
                        <>
                        <Flex justifyContent="center">
                            <Book width="120px" height="120px"/>
                        </Flex>
                        <Flex justifyContent="center">
                            <Text>{t('No item activity yet')}</Text>
                        </Flex>
                        </>
                    )}
                    
                </Flex>
            </ExpandablePanel>
        </Flex>
    )
}

export default OffersSection