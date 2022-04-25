import React, { useCallback, useMemo, useState } from 'react'
import { Book, Tag } from 'react-feather'
import styled from 'styled-components'
import { AddressZero } from '@ethersproject/constants'
import { Button, ChartIcon, Flex, LinkExternal, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ETHER, JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import { NFTAssetType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useToken } from 'hooks/Tokens'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getFullDisplayBalance } from 'utils/formatBalance'
import {truncateAddress} from 'utils/truncateHash'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { BIG_ONE } from 'utils/bigNumber'
import { LinkWrapper } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import ExpandablePanel from '../../components/ExpandablePanel'
import { Auction, Listing, NFTAuctionStatus, NFTMeta } from '../../hooks/types'
import { useCancelAuction } from '../../hooks/useListNFT'
import { getAuctionStatus, getAuctionStatusColor, getAuctionStatusText } from '../../utils/auctionHelpers'
import { usePlaceBid } from '../../hooks/usePlaceBid'
import { useClaimAuction } from '../../hooks/useClaimAuction'

const StatusText = styled(Text)<{statusColor}>`
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    text-align: center;
    ${({ statusColor }) =>
        `
        background: ${statusColor.background};
        color: ${statusColor.text};
        `
    }
`
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
    grid-template-columns: 20px repeat(3, 1fr);
    & :nth-child(2) {
      display: none;
    }
    & :nth-child(3) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 20px repeat(5, 1fr);
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
    & :nth-child(1) {
      display: block;
    }
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
const TableLoader: React.FC = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<{ 
    auction: Auction; 
    index: number, 
    account?: string, 
    reloadSell: () => void }
> = ({ auction, index, account, reloadSell }) => {
    const { t } = useTranslation()
    const { isXs, isSm } = useMatchBreakpoints()
    const { theme } = useTheme()
    const { toastSuccess, toastError } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const {onCancelAuction} = useCancelAuction()

    const payToken = useToken(auction.useEth ? null : auction.payToken)
    const tokenDecimals = useMemo(() => {
        return auction.useEth ? ETHER.decimals : payToken?.decimals
    }, [payToken, auction.useEth])
    const tokenSymbol = useMemo(() => {
        return auction.useEth ? ETHER.symbol : payToken?.symbol
    }, [payToken, auction.useEth])
    const bidAmount = useMemo(() => {
        if (auction.lastBidder === AddressZero) {
            return auction.lastPrice
        }

        let increaseAmount = auction.lastPrice.dividedBy(10).decimalPlaces(0, 1)
        if (increaseAmount.eq(0)) {
            increaseAmount = BIG_ONE
        }
        return auction.lastPrice.plus(increaseAmount)
    }, [auction])
    const [approval, approveCallback] = useApproveCallback(!auction.useEth && payToken ? new TokenAmount(payToken, JSBI.BigInt(bidAmount.toString())) : undefined, getNftMarketAddress())
    const { onPlaceBid } = usePlaceBid(auction.id)
    const { onClaimAuction, onClaimBackAuction } = useClaimAuction(auction.id)

    const isSeller = useMemo(() => {
        return auction.seller?.toLowerCase() === account.toLowerCase()
    }, [account, auction])

    const isWinner = useMemo(() => {
        return account && auction.lastBidder && account.toLowerCase() === auction.lastBidder.toLowerCase()
    }, [auction, account])

    const status = useMemo(() => {
        return getAuctionStatus(auction)
    }, [auction])

    const statusText = useMemo(() => {
        return getAuctionStatusText(status, t)
    }, [status, t])

    const statusColor = useMemo(() => {
        return getAuctionStatusColor(status, theme)
    }, [status, theme])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelAuction(auction.id)
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('The sale has been canceled successfully')
            )
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setCanceling(false)
        }
    }, [toastError, toastSuccess, t, onCancelAuction,reloadSell, auction])

    const handleGetNftBack = useCallback(async () => {
        try {
            setCanceling(true)
            await onClaimBackAuction()
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('You collected the nft back successfully')
            )
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setCanceling(false)
        }
    }, [toastError, toastSuccess, t, onClaimBackAuction,reloadSell])

    const handleBid = useCallback(async () => {
        try {
            setPendingTx(true)
            await onPlaceBid(auction.useEth, bidAmount)
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('You have placed a bid successfully')
            )
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setPendingTx(false)
        }
    }, [toastSuccess, toastError, reloadSell, t, onPlaceBid, auction, bidAmount])

    const handleClaim = useCallback(async () => {
        try {
            setPendingTx(true)
            await onClaimAuction()
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('You have claimed successfully')
            )
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setPendingTx(false)
        }
    }, [toastSuccess, toastError, reloadSell, t, onClaimAuction])



    const renderSellerAction = () => {
        if (status === NFTAuctionStatus.FAILED) {
            return (
            <Button scale="sm" variant="primary" disabled={canceling || auction.lastBidder !== AddressZero} onClick={handleGetNftBack}>
                {canceling ? (<Dots>{t('Processing')}</Dots>) : t('Get NFT back')}
            </Button>
            )
        }

        if (status === NFTAuctionStatus.DEALED) {
            return (
            <Button
                scale="sm" variant="primary"
                disabled={pendingTx}
                onClick={handleClaim}
            >
                {pendingTx ? (
                <Dots>{t('Processing')}</Dots>
                ) : t('Claim Now')}
            </Button>
            )
        }

        if (status === NFTAuctionStatus.RUNNING) {
            return (
            <Button scale="sm" variant="primary" disabled={canceling || auction.lastBidder !== AddressZero} onClick={handleCancel}>
                {canceling ? (<Dots>{t('Processing')}</Dots>) : t('Cancel')}
            </Button>
            )
        }

        return (<></>)
    }

    const renderApprovalOrBidButton = () => {
        if (status === NFTAuctionStatus.DEALED && (isSeller || isWinner)) {
            return (
                <Button
                    scale="md" variant="primary"
                    disabled={pendingTx}
                    onClick={handleClaim}
                >
                    {pendingTx ? (
                    <Dots>{t('Processing')}</Dots>
                    ) : t('Claim Now')}
                </Button>
            )
        }
        return auction.useEth || approval === ApprovalState.APPROVED ? (
            <Button
            scale="sm" variant="primary"
            disabled={isSeller || pendingTx}
            onClick={handleBid}
            >
            {pendingTx ? (
                <Dots>{t('Processing')}</Dots>
            ) : t('Bid')}
            </Button>
        ) : (
            <Button scale="sm" variant="primary" disabled={isSeller || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
            {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
            </Button>
        )
    }
    return (
        <ResponsiveGrid>
            <Cell>
                <Text>{auction.id}</Text>
            </Cell>
            <Cell>
                <LinkWrapper to={`/nft/profile/${auction.seller}`}>
                    <Text color="primary" fontSize="14px">
                        {truncateAddress(auction.seller, 6)}
                    </Text>
                </LinkWrapper>
            </Cell>
            <Cell>
                { auction.lastBidder && auction.lastBidder !== AddressZero ? (
                    <LinkWrapper to={`/nft/profile/${auction.lastBidder}`}>
                        <Text color="primary" fontSize="14px">
                            {truncateAddress(auction.lastBidder, 6)}
                        </Text>
                    </LinkWrapper>
                ) : (
                    <Text fontSize="14px" fontWeight={400}>-</Text>
                )}
            </Cell>
            <Cell>
                <Text>
                {auction.amount.toString()} / {auction.useEth || payToken ? getFullDisplayBalance(auction.lastPrice, tokenDecimals) : ''} {tokenSymbol}
                </Text>
            </Cell>
            <Cell>
                <StatusText statusColor={statusColor}>
                    {statusText}
                </StatusText>
            </Cell>
            <Cell>
            {isSeller ? (
                <>
                { account && renderSellerAction()}
                </>
            ) : (
                <>
                { (status === NFTAuctionStatus.RUNNING || status === NFTAuctionStatus.DEALED) && account && renderApprovalOrBidButton()}
                </>
            )}
            </Cell>
        </ResponsiveGrid>
    )
}

interface AuctionsSectionProps {
    metadata: NFTMeta
    account?: string
    auctions?: Auction[]
    reloadSell: () => void
}

const AuctionsSection: React.FC<AuctionsSectionProps> = ({metadata, auctions, account, reloadSell}) => {

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
                icon={<Tag/>}
                title={t('Auctions')}
            >
                <Flex flexDirection="column" margin="12px">
                    {auctions && auctions.length > 0 ? (
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
                                {t('Seller')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Purchaser')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Amount / Price')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('Status')}
                                </ClickableColumnHeader>
                                <ClickableColumnHeader
                                color="secondary"
                                fontSize="12px"
                                bold
                                textTransform="uppercase"
                                >
                                {t('')}
                                </ClickableColumnHeader>
                            </ResponsiveGrid>

                            <Break />
                            {auctions.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <DataRow index={index} auction={item} account={account} reloadSell={reloadSell}/>
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

export default AuctionsSection