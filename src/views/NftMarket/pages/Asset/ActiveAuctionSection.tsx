import React, { useCallback, useMemo, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import styled from 'styled-components'
import { Button, Flex, Text, TradeIcon } from '@pancakeswap/uikit'
import { ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { BIG_ONE } from 'utils/bigNumber'
import { useToken } from 'hooks/Tokens'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Auction, NFTResponse } from '../../hooks/types'
import { useCancelAuction } from '../../hooks/useListNFT'
import ExpandablePanel from '../../components/ExpandablePanel'
import AuctionTimer from './AuctionTimer'
import { usePlaceBid } from '../../hooks/usePlaceBid'
import { useClaimAuction } from '../../hooks/useClaimAuction'

const StatusText = styled(Text)<{statusColor}>`
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    ${({ statusColor }) =>
        `
        background: ${statusColor.background};
        color: ${statusColor.text};
        `
    }
`

export enum NFTAuctionStatus {
    NOT_RUNNING,
    RUNNING,
    FAILED,
    DEALED,
    FINISHED,
    CANCELED
}

interface ActiveAuctionSectionProps {
    nft?: NFTResponse
    account?: string
    auction?: Auction
    reloadSale: () => void
}

const ActiveAuctionSection: React.FC<ActiveAuctionSectionProps> = ({account, nft, auction, reloadSale}) => {

    const { t } = useTranslation()
    const { toastSuccess, toastError } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const { theme } = useTheme()
    const {onCancelAuction} = useCancelAuction()

    const payToken = useToken(auction.useEth ? null : auction.payToken)
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
    const { onClaimAuction } = useClaimAuction(auction.id)

    const isSeller = useMemo(() => {
        return account && account.toLowerCase() === auction.seller.toLowerCase()
    }, [auction, account])

    const isWinner = useMemo(() => {
        return account && auction.lastBidder && account.toLowerCase() === auction.lastBidder.toLowerCase()
    }, [auction, account])

    const status = useMemo(() => {
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
    }, [auction])

    const statusText = useMemo(() => {
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
    }, [status, t])

    const statusColor = useMemo(() => {
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
    }, [status, theme])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelAuction(auction.id)
            reloadSale()
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
    }, [toastError, toastSuccess, t, onCancelAuction,reloadSale, auction])

    const handleBid = useCallback(async () => {
        try {
            setPendingTx(true)
            await onPlaceBid(auction.useEth, bidAmount)
            reloadSale()
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
    }, [toastSuccess, toastError, reloadSale, t, onPlaceBid, auction, bidAmount])

    const handleClaim = useCallback(async () => {
        try {
            setPendingTx(true)
            await onClaimAuction()
            reloadSale()
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
    }, [toastSuccess, toastError, reloadSale, t, onClaimAuction])

    const renderApprovalOrBidButton = () => {
        if (status === NFTAuctionStatus.DEALED && (isSeller || isWinner)) {
            return (
                <Button
                    scale="md" variant="primary" width="100%"
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
          scale="md" variant="primary" width="100%"
          disabled={isSeller || pendingTx}
          onClick={handleBid}
        >
          {pendingTx ? (
            <Dots>{t('Processing')}</Dots>
          ) : t('Bid Now')}
        </Button>
      ) : (
        <Button scale="md" variant="primary" width="100%" disabled={isSeller || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
        </Button>
      )
    }

    
    return (
        
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                icon={<TradeIcon/>}
                title={t('Active Auction #%id%', {id: auction.id})}
            >
                <Flex flexDirection="column" padding="12px">
                    <Flex flexDirection="row">
                        <Flex flexDirection="column" flex="1">
                            <Flex>
                                <Text fontSize="12px">{t('Token Amount')}</Text>
                            </Flex>
                            <Flex>
                                <Text color="secondary" fontSize="24px">{auction.amount.toString()}</Text>
                            </Flex>
                            <Flex flexDirection="row">
                                <Flex flexDirection="column" flex="1">
                                    <Flex mt="8px">
                                        <Text fontSize="12px">{t('Last Price')}</Text>
                                    </Flex>
                                    { auction.useEth ? (
                        
                                        <Flex>
                                        <Text color="secondary" fontSize="24px">{getFullDisplayBalance(auction.lastPrice)} {ETHER.symbol}</Text>
                                        </Flex>
                                    ) : (
                        
                                        <Flex>
                                            <Text color="secondary" fontSize="24px">{ payToken ? getFullDisplayBalance(auction.lastPrice, payToken.decimals) : '0.00'} {payToken?.symbol}</Text>
                                        </Flex>
                                    )}
                                </Flex>

                                { !isSeller && (
                                    <Flex flexDirection="column" flex="1">
                                    <Flex mt="8px">
                                    <Text fontSize="12px">{t('Next Price')}</Text>
                                    </Flex>
                                    { auction.useEth ? (
            
                                    <Flex>
                                    <Text color="secondary" fontSize="24px">{getFullDisplayBalance(bidAmount)} {ETHER.symbol}</Text>
                                    </Flex>
                                    ) : (
            
                                    <Flex>
                                        <Text color="secondary" fontSize="24px">{ payToken ? getFullDisplayBalance(bidAmount, payToken.decimals) : '0.00'} {payToken?.symbol}</Text>
                                    </Flex>
                                    )}
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" flex="1">
                            <Flex mb="12px">
                                <StatusText statusColor={statusColor}>
                                    {t('Status')}: {statusText}
                                </StatusText>
                            </Flex>
                            <AuctionTimer auction={auction}/>
                        </Flex>
                    </Flex>
                    <Flex>
                        {isSeller ? (
                            <>
                            {!auction.isTaken && (
                                <Button disabled={canceling || auction.lastBidder !== AddressZero} onClick={handleCancel}>
                                    {canceling ? (<Dots>{t('Processing')}</Dots>) : t('Cancel')}
                                </Button>
                            )}
                            </>
                        ) : (
                            <>
                            { (status === NFTAuctionStatus.RUNNING || status === NFTAuctionStatus.DEALED) && (
                                <Flex flexDirection="column" mt="12px">
                                    { account ? renderApprovalOrBidButton() : (
                                        <ConnectWalletButton disabled={isSeller}/>
                                    )}
                                </Flex>
                            )}
                            </>
                        )}
                        
                    </Flex>
                </Flex>
            </ExpandablePanel>
        </Flex>
    )
}

export default ActiveAuctionSection