import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Message, Progress, Button } from '@pancakeswap/uikit'
import { JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import { StyledNumericalInput } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { SALE_FINALIZE_DEADLINE } from 'config/constants'
import useInterval from 'hooks/useInterval'
import useToast from 'hooks/useToast'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useToken } from 'hooks/Tokens'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { BigNumber} from 'bignumber.js'
import SaleTimer from './SaleTimer'
import { PublicSaleData } from '../../types'
import { useBuySale, useClaimRefundSale, useClaimSale } from '../../hooks/useBuySale'
import { getSaleUserData } from '../../hooks/getSales'
import SaleBaseSection from './SaleBaseSection'

export interface SaleActionSectionProps {
    sale: PublicSaleData
    account: string
    onReloadSale?: () => void
}

const SaleActionSection: React.FC<SaleActionSectionProps> = ({account, sale, onReloadSale}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [value, setValue] = useState('')
    const [text, setText] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
    const [claimingRefund, setClaimingRefund] = useState(false)
    const [expired, setExpired] = useState(sale.finalized)
    const [buyable, setBuyable] = useState(false)
    const [showBuy, setShowbuy] = useState(false)
    const [showClaim, setShowClaim] = useState(false)
    const [whitelisted, setWhitelisted] = useState(true)

    const token = useToken(sale.token)

    const baseToken = useToken(sale.baseToken)
    const {balance: baseTokenBalance} = useTokenBalance(sale.baseToken)
    const {balance: BNBBalance} = useGetBnbBalance()
    const baseTokenSymbol = useMemo(() => {
        if (sale.useETH) {
            return 'CRO'
        }
        if (baseToken) {
            return baseToken.symbol
        }

        return ''
    }, [sale, baseToken])

    const baseTokenDecimals = useMemo(() => {
        if (sale.useETH) {
            return 18
        }
        if (baseToken) {
            return baseToken.decimals
        }

        return -1
    }, [sale, baseToken])

    const [loadContribution, setLoadContribution] = useState(false)

    const [contribution, setContribution] = useState<BigNumber|null>(null)

    const [balance, setBalance] = useState<BigNumber|null>(null)
    const [balanceEth, setBalanceEth] = useState<BigNumber|null>(null)

    useEffect(() => {
        const fetchContribution = async () =>  {
            const {contribution:contribution_, balanceEth: balanceEth_, balance:balance_, whitelisted: whitelisted_} = await getSaleUserData(sale.address, account)
            setContribution(contribution_)
            setBalance(balance_)
            setBalanceEth(balanceEth_)
            setWhitelisted(whitelisted_)
            setLoadContribution(false)
        }

        fetchContribution()
    }, [account, sale.address, loadContribution, balanceEth])

    const maxNumber = useMemo(() => {
        const remaining = sale.cap.minus(sale.weiRaised)
        const remainingContrib = sale.maxContribution.minus(contribution)

        return remaining.gt(remainingContrib) ? remainingContrib : remaining;
    }, [sale, contribution])

    const valueNumber = baseTokenDecimals < 0 ? BIG_ZERO : new BigNumber(value).multipliedBy(BIG_TEN.pow(baseTokenDecimals))

    const [approval, approveCallback] = useApproveCallback(baseToken ? new TokenAmount(baseToken, JSBI.BigInt(value)) : undefined, sale.address)

    const { onBuySale, onBuySaleETH } = useBuySale(sale.address)
    const { onClaimSale } = useClaimSale(sale.address)
    const { onClaimRefundSale } = useClaimRefundSale(sale.address)


    useInterval(() => {
        const now = Math.floor(new Date().getTime() / 1000);
        if (now > sale.closingTime + SALE_FINALIZE_DEADLINE) {
            setExpired(true)
        }
        if (now > sale.closingTime) {
            setBuyable(false)
            setShowbuy(false)
            setShowClaim(true)
        } else if (now > sale.openingTime && sale.weiRaised.lte(sale.cap)) {
            setBuyable(true)
            setShowbuy(true)
            setShowClaim(false)
        } else {
            setBuyable(false)
            setShowbuy(true)
            setShowClaim(false)
        }
    }, 1000)


    const handleClickMax = useCallback(() => {
        if (baseTokenDecimals >= 0) {
            setValue(getFullDisplayBalance(maxNumber, baseTokenDecimals))
        }
    }, [baseTokenDecimals, maxNumber])

    const handleBuy = useCallback(async () => {
        try {
            setPendingTx(true)
            const receipt = sale.useETH ? await onBuySaleETH(account, valueNumber.toString()) : await onBuySale(account, valueNumber.toString())
            onReloadSale()
            setLoadContribution(!loadContribution)
            toastSuccess(
            `${t('Purchased')}!`,
            t('You have been purchased %amount% tokens successfully', {
                amount: getFullDisplayBalance(valueNumber.multipliedBy(sale.rate).div(BIG_TEN.pow(sale.rateDecimals)), token.decimals)
            }),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setPendingTx(false)
        }
    }, [toastError, toastSuccess, t, onBuySale, onBuySaleETH, onReloadSale, sale, valueNumber, account, loadContribution, token])

    const handleClaim = useCallback(async () => {
        try {
            const contribution_ = contribution
            setPendingTx(true)
            await onClaimSale(account)
            onReloadSale()
            setLoadContribution(!loadContribution)
            toastSuccess(
            `${t('Success')}!`,
            t('You have been claimed your tokens successfully', {
                amount: getFullDisplayBalance(contribution_.multipliedBy(sale.rate), token.decimals)
            }),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setPendingTx(false)
        }
    }, [toastError, toastSuccess, t, onClaimSale, onReloadSale, sale, contribution, token, account, loadContribution])

    const handleClaimRefund = useCallback(async () => {
        try {
            setClaimingRefund(true)
            await onClaimRefundSale(account)
            onReloadSale()
            setLoadContribution(!loadContribution)
            toastSuccess(
            `${t('Success')}!`,
            t('You have been claimed the refund successfully'),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setClaimingRefund(false)
        }
    }, [toastError, toastSuccess, t, onClaimRefundSale, onReloadSale, account, loadContribution])



    const renderApprovalOrPurchaseButton = () => {
        return (sale.whitelistEnabled && !whitelisted) || !baseToken || approval === ApprovalState.APPROVED ? (
            <Button 
                scale="sm" 
                disabled={!buyable || pendingTx || !valueNumber || !valueNumber.isFinite() || valueNumber.eq(0) || valueNumber.gt(maxNumber) || (sale.whitelistEnabled && !whitelisted)} 
                onClick={handleBuy}
            >
                { pendingTx ? (<Dots>{t('Purchasing')}</Dots>) : (sale.whitelistEnabled && !whitelisted) ? t('You are not in whitelist') : t('Purchase')}
            </Button>
        ) : (
            <Button mt="8px" width="100%" disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
            {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
            </Button>
        )
    }

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Message variant="warning" mb="24px">
                    <Text>
                    {t(
                        "Make sure the website is crowfi.app!",
                    )}
                    </Text>
                </Message>
                { sale.canceled ? (
                    <Flex justifyContent="center" mt="16px" mb="16px">
                        <Text fontSize="16px">
                            { t('Canceled') }
                        </Text>
                    </Flex>
                ) : !sale.finalized && (
                    <SaleTimer startTime={sale.openingTime} endTime={sale.closingTime} />
                )}
                <Flex flexDirection="column" mt="8px">
                    <Progress primaryStep={sale.weiRaised.multipliedBy(100).div(sale.cap).toNumber()} />
                    <Flex justifyContent="space-between">
                        { baseTokenDecimals >= 0 && (
                            <>
                            <Text fontSize="12px">
                                {getFullDisplayBalance(sale.weiRaised, baseTokenDecimals)} {baseTokenSymbol}
                            </Text>
                            <Text fontSize="12px">
                                {getFullDisplayBalance(sale.cap, baseTokenDecimals)} {baseTokenSymbol}
                            </Text>
                            </>
                        )}
                    </Flex>
                </Flex>
                { showClaim && account === sale.owner && (
                    <></>
                )}
                {contribution && contribution.isFinite() && baseTokenDecimals >= 0 && (
                <Text fontSize="14px" fontStyle="bold" mt="8px" textAlign="center">
                    {t('Your Contribution: %amount% %currency%', {amount: getFullDisplayBalance(contribution, baseTokenDecimals), currency:baseTokenSymbol})}
                </Text>
                )}
                
                { !sale.canceled && token && balance && balance.isFinite() && (
                    <Text fontSize="14px" fontStyle="bold" mt="8px" textAlign="center">
                        {t('Claimable : %amount% %currency%', {amount: getFullDisplayBalance(balance, token.decimals), currency:token.symbol})}
                    </Text>
                )}
                { sale.canceled && contribution && contribution.isFinite() && contribution.gt(0) && (
                    <Flex justifyContent="center" mt="8px">
                        { !account ? (
                            <ConnectWalletButton mt="8px" width="100%" />
                        ) : (
                        <Button 
                            scale="sm" 
                            disabled={claimingRefund || !balanceEth || balanceEth.lte(0)} 
                            onClick={handleClaimRefund}
                        >
                            { claimingRefund ? (<Dots>{t('Claiming')}</Dots>) : t('Claim Refund')}
                        </Button>
                        )}
                    </Flex>
                )}
                { !sale.canceled && (
                    <>

                    { showBuy && (
                        <>
                        <Flex justifyContent="space-between">
                            <Text fontSize="14px" fontStyle="bold" mt="8px">
                                {t('Amount (max: %amount% %currency%)', {amount: getFullDisplayBalance(maxNumber, baseTokenDecimals), currency:baseTokenSymbol})}
                            </Text>
                            <Text fontSize="14px" fontStyle="bold" mt="8px">
                                {t('Balance: %amount% %currency%', {amount: sale.useETH ? formatBigNumber(BNBBalance) : getFullDisplayBalance(baseTokenBalance, baseTokenDecimals), currency:baseTokenSymbol})}
                            </Text>
                        </Flex>
                        
                        <Flex position="relative">
                            <StyledNumericalInput
                                value={value}
                                onUserInput={(val) => setValue(val)} />
                            <Button scale="xs" style={{position: 'absolute', right: '12px', top: '10px'}} onClick={handleClickMax}>{t('MAX')}</Button>
                        </Flex>
                        <Flex justifyContent="center" mt="8px">
                        {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrPurchaseButton()}
                        </Flex>
                        </>
                    )}
                    { showClaim && (
                    <Flex justifyContent="center" mt="8px">
                        { !account ? (
                            <ConnectWalletButton mt="8px" width="100%" />
                        ) : (
                            <Button scale="sm" disabled={pendingTx || !balance || !balance.isFinite() || balance.eq(0) || (!expired && !sale.finalized) } onClick={handleClaim}>
                                { pendingTx ? (<Dots>{t('Claiming')}</Dots>) : t('Claim')}
                            </Button>
                        )
                        }
                    </Flex>
                    )}
                    </>
                )}
            </Flex>
        </>
    )
}

export default SaleActionSection