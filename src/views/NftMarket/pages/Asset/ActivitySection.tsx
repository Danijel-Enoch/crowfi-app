import React, { useMemo } from 'react'
import { ArrowDownCircle, CheckCircle, Clock, ShoppingCart, ThumbsUp, UploadCloud, XCircle } from 'react-feather'
import { Flex, LinkExternal, SwapVertIcon, Text, TradeIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import {formatDistance} from 'date-fns'
import { NFTAssetType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import truncateHash, { truncateAddress } from 'utils/truncateHash'
import { LinkWrapper } from 'components/Launchpad/StyledControls'
import { ActivitiesAPIResponse, ActivityResponse, NFTActivityType, NFTMeta } from '../../hooks/types'
import ExpandablePanel from '../../components/ExpandablePanel'

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


  grid-template-columns: 2fr repeat(5, 1fr);
`

const DataRow: React.FC<{ 
    activity: ActivityResponse; 
    index: number, 
    account?: string, 
}> = ({ activity, index, account }) => {
    const { t } = useTranslation()

    const isFrom = useMemo(() => {
        return activity.from?.address?.toLowerCase() === account?.toLowerCase()
    }, [account, activity])

    const isTo = useMemo(() => {
        return activity.to?.address?.toLowerCase() === account?.toLowerCase()
    }, [account, activity])

    const typeIcon = () => {
        switch(activity.type) {
            case NFTActivityType.LISTING:
                return (
                    <ShoppingCart  width="16px"/>
                )
            case NFTActivityType.LISTING_CANCELED:
                return (
                    <XCircle  width="16px"/>
                )
            case NFTActivityType.LISTING_DONE:
                return (
                    <CheckCircle  width="16px"/>
                )
            case NFTActivityType.AUCTION:
                return (
                    <Clock  width="16px"/>
                )
            case NFTActivityType.AUCTION_CANCELED:
                return (
                    <XCircle  width="16px"/>
                )
            case NFTActivityType.AUCTION_TAKED:
                return (
                    <CheckCircle  width="16px"/>
                )
            case NFTActivityType.AUCTION_TAKED_BACK:
                return (
                    <ArrowDownCircle  width="16px"/>
                )
            case NFTActivityType.MINT:
                return (
                    <UploadCloud width="16px"/>
                )
            case NFTActivityType.BID:
                return (
                    <ThumbsUp width="16px"/>
                )
            default: 
                return (
                    <TradeIcon width="16px"/>
                )
        }
    }

    const typeText = () =>  {

        switch(activity.type) {
            case NFTActivityType.LISTING:
                return t('Sell')
            case NFTActivityType.LISTING_CANCELED:
                return t('Sell Canceled')
            case NFTActivityType.LISTING_DONE:
                return t('Sold')
            case NFTActivityType.AUCTION:
                return t('Auction')
            case NFTActivityType.AUCTION_CANCELED:
                return t('Auction Canceled')
            case NFTActivityType.AUCTION_TAKED:
                return t('Deal')
            case NFTActivityType.AUCTION_TAKED_BACK:
                return t('Auction Refund')
            case NFTActivityType.MINT:
                return t('Auction Mint')
            case NFTActivityType.BID:
                return t('Bid')
            default: 
                return t('Transfer')
        }
    }
    return (
        <ResponsiveGrid>
            <Cell>
                <Flex alignItems="center">
                {typeIcon()}
                <Text fontSize="14px" ml="8px">{typeText()}</Text>
                </Flex>
            </Cell>
            <Cell>
                {activity.price}
            </Cell>
            <Flex alignItems="center">
                {activity.amount}
            </Flex>
            <Cell>
                {activity.from && (
                    <>
                    <LinkWrapper to={`/nft/profile/${activity.from?.address}`}>
                        <Text color="primary" fontSize="14px" style={{wordBreak: "break-all"}}>
                        {isFrom ? 'You' : activity.from?.name ?? truncateAddress(activity.from?.address, 6)}
                        </Text>
                    </LinkWrapper>
                    </>
                )}
                
            </Cell>
            <Cell>
                {activity.to && (
                    <>
                    <LinkWrapper to={`/nft/profile/${activity.to?.address}`}>
                        <Text color="primary" fontSize="14px" style={{wordBreak: "break-all"}}>
                        {isTo ? 'You' : activity.to?.name ?? truncateAddress(activity.to?.address, 6)}
                        </Text>
                    </LinkWrapper>
                    </>
                )}
            </Cell>
            <Cell>
                <LinkExternal href={getBscScanLink(activity.txId, 'transaction')} fontSize="14px">
                    {formatDistance(new Date(activity.creationTime * 1000), new Date())} ago
                </LinkExternal>
            </Cell>
        </ResponsiveGrid>
    )
}
interface ActivitySectionProps {
    metadata: NFTMeta
    activities: ActivitiesAPIResponse
    account?: string
}

const ActivitySection: React.FC<ActivitySectionProps> = ({metadata, activities, account}) => {

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
                icon={<SwapVertIcon/>}
                title={t('Item Activity')}
            >
                <Flex flexDirection="column" margin="12px">
                    {activities && activities.count > 0 ? (
                        <Flex flexDirection="column">
                            <ResponsiveGrid>
                                <Text color="secondary" fontSize="12px" bold>
                                    {t('Event')}
                                </Text>
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
                                    {t('Quantity')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                    {t('From')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                    {t('To')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                    {t('Date')}
                                </ClickableColumnHeader>
                            </ResponsiveGrid>

                            <Break />
                            {activities && activities.rows.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <DataRow index={index} activity={item} account={account}/>
                                        <Break />
                                    </React.Fragment>
                                )
                            })}
                        </Flex>
                    ) : (
                        <div style={{height: "100px"}}/>
                    )}
                </Flex>
            </ExpandablePanel>
        </Flex>
    )
}

export default ActivitySection