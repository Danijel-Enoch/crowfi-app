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
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback'
import { getFullDisplayBalance } from 'utils/formatBalance'
import {truncateAddress} from 'utils/truncateHash'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { LinkWrapper } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ExpandablePanel from '../../components/ExpandablePanel'
import { Listing, NFTMeta } from '../../hooks/types'
import { useAcceptOffer } from '../../hooks/useAcceptOffer'
import { useCancelOffer } from '../../hooks/useListNFT'

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
    listing: Listing; 
    index: number, 
    account?: string, 
    myBalance?: number
    reloadSell: () => void }
> = ({ listing, index, account, myBalance, reloadSell }) => {
    const { t } = useTranslation()
    const { isXs, isSm } = useMatchBreakpoints()
    const { theme } = useTheme()
    const { toastSuccess, toastError } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const {onCancelOffer} = useCancelOffer()

    const payToken = useToken(listing.useEth ? null : listing.payToken)
    const tokenDecimals = useMemo(() => {
        return listing.useEth ? ETHER.decimals : payToken?.decimals
    }, [payToken, listing.useEth])
    const tokenSymbol = useMemo(() => {
        return listing.useEth ? ETHER.symbol : payToken?.symbol
    }, [payToken, listing.useEth])

    const [approval, approveCallback]  = useNFTApproveCallback(listing.nft, getNftMarketAddress())
    const { onAcceptOffer } = useAcceptOffer(listing.id)

    const isPurchaser = useMemo(() => {
        return listing.purchaser?.toLowerCase() === account.toLowerCase()
    }, [account, listing])

    const statusText = useMemo(() => {
        if (listing.isSold) {
            if (listing.seller === AddressZero) {
                return t('Canceled')
            }
            return t('Sold')
        }

        return t('Running')
    }, [listing, t])

    const statusColor = useMemo(() => {
        const res: {background: string, text: string} = {
            background: theme.colors.backgroundAlt,
            text: theme.colors.text
        }

        if (listing.isSold) {
            if (listing.seller !== AddressZero) {
                res.background = theme.colors.success
                res.text = 'white'
            }
        } else {
            res.background = '#92c8f0'
        }

        return res
    }, [listing, theme])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelOffer(listing.id)
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('The offer has been canceled successfully')
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
    }, [toastError, toastSuccess, t, onCancelOffer,reloadSell, listing])

    const handleAccept = useCallback(async () => {
        try {
            setPendingTx(true)
            await onAcceptOffer()
            reloadSell()
            toastSuccess(
            `${t('Success')}!`,
            t('You have accepted this offer successfully')
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
    }, [toastSuccess, toastError, reloadSell, t, onAcceptOffer])

    const renderApprovalOrAcceptButton = () => {
      return listing.useEth || approval === ApprovalState.APPROVED ? (
        <Button
          scale="sm" variant="primary"
          disabled={isPurchaser || listing.isSold || pendingTx || !myBalance || listing.amount.toNumber() > myBalance}
          onClick={handleAccept}
        >
          {pendingTx ? (
            <Dots>{t('Processing')}</Dots>
          ) : t('Accept')}
        </Button>
      ) : (
        <Button scale="sm" variant="primary" disabled={isPurchaser || listing.isSold || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
        </Button>
      )
    }
    return (
        <ResponsiveGrid>
            <Cell>
                <Text>{listing.id}</Text>
            </Cell>
            <Cell>
                <LinkWrapper to={`/nft/profile/${listing.seller}`}>
                    <Text color="primary" fontSize="14px">
                        {truncateAddress(listing.seller, 6)}
                    </Text>
                </LinkWrapper>
            </Cell>
            <Cell>
                { listing.purchaser && listing.purchaser !== AddressZero ? (
                    <LinkWrapper to={`/nft/profile/${listing.purchaser}`}>
                        <Text color="primary" fontSize="14px">
                            {truncateAddress(listing.purchaser, 6)}
                        </Text>
                    </LinkWrapper>
                ) : (
                    <Text fontSize="14px" fontWeight={400}>-</Text>
                )}
            </Cell>
            <Cell>
                <Text>
                {listing.amount.toString()} / {listing.useEth || payToken ? getFullDisplayBalance(listing.price, tokenDecimals) : ''} {tokenSymbol}
                </Text>
            </Cell>
            <Cell>
                <StatusText statusColor={statusColor}>
                    {statusText}
                </StatusText>
            </Cell>
            <Cell>
            {isPurchaser ? (
                <>
                {!listing.isSold && (
                    <Button scale="sm" disabled={canceling} onClick={handleCancel}>
                        {canceling ? (<Dots>{t('Processing')}</Dots>) : t('Cancel')}
                    </Button>
                )}
                </>
            ) : (
                <>
                { account ? renderApprovalOrAcceptButton() : (
                    <ConnectWalletButton disabled={listing.isSold}/>
                )}
                </>
            )}
            </Cell>
        </ResponsiveGrid>
    )
}

interface OffersSectionProps {
    metadata: NFTMeta
    account?: string
    myBalance?: number
    offers?: Listing[]
    reloadSell: () => void
}

const OffersSection: React.FC<OffersSectionProps> = ({metadata, offers, account, myBalance, reloadSell}) => {

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
                title={t('Offers')}
            >
                <Flex flexDirection="column" margin="12px">
                    {offers && offers.length > 0 ? (
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
                            {offers.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <DataRow index={index} listing={item} account={account} myBalance={myBalance} reloadSell={reloadSell}/>
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