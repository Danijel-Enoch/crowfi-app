import React, { useCallback, useMemo, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import styled from 'styled-components'
import { Button, Flex, Text, TradeIcon } from '@pancakeswap/uikit'
import { ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { useToken } from 'hooks/Tokens'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Listing, NFTResponse } from '../../hooks/types'
import { useCancelListing } from '../../hooks/useListNFT'
import ExpandablePanel from '../../components/ExpandablePanel'
import { usePurchaseNFT } from '../../hooks/usePurchaseNFT'

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


interface ActiveListingSectionProps {
    nft?: NFTResponse
    account?: string
    sell?: Listing
    reloadSell: () => void
}

const ActiveListingSection: React.FC<ActiveListingSectionProps> = ({account, nft, sell, reloadSell}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const { toastSuccess, toastError } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const {onCancelListing} = useCancelListing()

    const payToken = useToken(sell.useEth ? null : sell.payToken)
    const [approval, approveCallback] = useApproveCallback(!sell.useEth && payToken ? new TokenAmount(payToken, JSBI.BigInt(sell.price.toString())) : undefined, getNftMarketAddress())
    const { onPurchaseNFT } = usePurchaseNFT(sell.id)

    const isSeller = useMemo(() => {
        return sell.seller?.toLowerCase() === account.toLowerCase()
    }, [account, sell])

    const statusText = useMemo(() => {
        if (sell.isSold) {
            if (sell.purchaser === AddressZero) {
                return t('Canceled')
            }
            return t('Sold')
        }

        return t('Running')
    }, [sell, t])

    const statusColor = useMemo(() => {
        const res: {background: string, text: string} = {
            background: theme.colors.backgroundAlt,
            text: theme.colors.text
        }

        if (sell.isSold) {
            if (sell.purchaser !== AddressZero) {
                res.background = theme.colors.success
                res.text = 'white'
            }
        } else {
            res.background = '#92c8f0'
        }

        return res
    }, [sell, theme])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelListing(sell.id)
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
    }, [toastError, toastSuccess, t, onCancelListing,reloadSell, sell])

    const handlePurchase = useCallback(async () => {
        try {
            setPendingTx(true)
            await onPurchaseNFT(sell.useEth, sell.price)
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('You have purchased this token successfully')
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
    }, [toastSuccess, toastError, reloadSell, t, onPurchaseNFT, sell])

    const renderApprovalOrBidButton = () => {
      return sell.useEth || approval === ApprovalState.APPROVED ? (
        <Button
          scale="md" variant="primary"
          disabled={isSeller || sell.isSold || pendingTx}
          onClick={handlePurchase}
        >
          {pendingTx ? (
            <Dots>{t('Processing')}</Dots>
          ) : t('Purchase')}
        </Button>
      ) : (
        <Button scale="md" variant="primary" disabled={isSeller || sell.isSold || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
        </Button>
      )
    }

    
    return (
        
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                icon={<TradeIcon/>}
                title={t('Active Sale')}
            >
                <Flex flexDirection="column" padding="12px">
                    <Flex mb="12px">
                        <StatusText statusColor={statusColor}>
                            {t('Status')}: {statusText}
                        </StatusText>
                    </Flex>
                    <Flex>
                        <Text fontSize="12px">{t('Sale Price')}</Text>
                    </Flex>
                    { sell.useEth ? (
        
                        <Flex>
                        <Text color="secondary" fontSize="24px">{getFullDisplayBalance(sell.price)} {ETHER.symbol}</Text>
                        </Flex>
                    ) : (
        
                        <Flex>
                            <Text color="secondary" fontSize="24px">{ payToken ? getFullDisplayBalance(sell.price, payToken.decimals) : '0.00'} {payToken?.symbol}</Text>
                        </Flex>
                    )}
                    <Flex>
                        {isSeller ? (
                            <>
                            {!sell.isSold && (
                                <Button disabled={canceling} onClick={handleCancel}>
                                    {canceling ? (<Dots>{t('Processing')}</Dots>) : t('Cancel')}
                                </Button>
                            )}
                            </>
                        ) : (
                            <>
                            { account ? renderApprovalOrBidButton() : (
                                <ConnectWalletButton disabled={sell.isSold}/>
                            )}
                            </>
                        )}
                        
                    </Flex>
                </Flex>
            </ExpandablePanel>
        </Flex>
    )
}

export default ActiveListingSection