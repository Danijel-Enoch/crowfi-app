import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Message, Progress, Button } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { StyledNumericalInput } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useInterval from 'hooks/useInterval'
import useToast from 'hooks/useToast'
import { useToken } from 'hooks/Tokens'
import { BIG_TEN } from 'utils/bigNumber'
import { BigNumber} from 'bignumber.js'
import SaleTimer from './SaleTimer'
import { PublicSaleData } from '../../types'
import { useBuySale, useClaimSale } from '../../hooks/useBuySale'
import { getSaleUserData } from '../../hooks/getSales'

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
    const [buyable, setBuyable] = useState(false)
    const [showBuy, setShowbuy] = useState(false)
    const [showClaim, setShowClaim] = useState(false)

    const token = useToken(sale.token)

    const [loadContribution, setLoadContribution] = useState(false)

    const [contribution, setContribution] = useState<BigNumber|null>(null)

    const [balance, setBalance] = useState<BigNumber|null>(null)

    useEffect(() => {
        const fetchContribution = async () =>  {
            const {contribution:contribution_, balance:balance_} = await getSaleUserData(sale.address, account)
            setContribution(contribution_)
            setBalance(balance_)
            setLoadContribution(false)
        }

        fetchContribution()
    }, [account, sale.address, loadContribution])

    const maxNumber = useMemo(() => {
        let max = sale.cap.minus(sale.weiRaised)
        if (max.gt(BIG_TEN.pow(18).multipliedBy(50))) {
            max = BIG_TEN.pow(18).multipliedBy(50)
        }
        return max
    }, [sale])

    const valueNumber = new BigNumber(value).multipliedBy(BIG_TEN.pow(18))

    const { onBuySale } = useBuySale(sale.address)
    const { onClaimSale } = useClaimSale(sale.address)


    useInterval(() => {
        const now = Math.floor(new Date().getTime() / 1000);
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

    const handleClickMax = () => {
        setValue(getFullDisplayBalance(maxNumber))
    }

    const handleBuy = useCallback(async () => {
        try {
            setPendingTx(true)
            const receipt = await onBuySale(account, valueNumber.toString())
            onReloadSale()
            setLoadContribution(!loadContribution)
            toastSuccess(
            `${t('Purchased')}!`,
            t('You have been purchased %amount% tokens successfully', {
                amount: valueNumber.multipliedBy(sale.rate).div(BIG_TEN.pow(18)).toJSON()
            }),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setPendingTx(false)
        }
    }, [toastError, toastSuccess, t, onBuySale, onReloadSale, sale, valueNumber, account, loadContribution])

    const handleClaim = useCallback(async () => {
        try {
            const contribution_ = contribution
            setPendingTx(true)
            await onClaimSale(account)
            onReloadSale()
            setLoadContribution(!loadContribution)
            toastSuccess(
            `${t('Success')}!`,
            t('You have been purchased %amount% tokens successfully', {
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
                <SaleTimer startTime={sale.openingTime} endTime={sale.closingTime} />
                <Flex flexDirection="column" mt="8px">
                    <Progress primaryStep={sale.weiRaised.multipliedBy(100).div(sale.cap).toNumber()} />
                    <Flex justifyContent="space-between">
                        <Text fontSize="12px">
                            {getFullDisplayBalance(sale.weiRaised)} CRO
                        </Text>
                        <Text fontSize="12px">
                            {getFullDisplayBalance(sale.cap)} CRO
                        </Text>
                    </Flex>
                </Flex>
                { showClaim && account === sale.owner && (
                    <></>
                )}
                {contribution && contribution.isFinite() && (
                <Text fontSize="14px" fontStyle="bold" mt="8px" textAlign="center">
                    {t('Your Contribution: %amount% %currency%', {amount: getFullDisplayBalance(contribution), currency:'CRO'})}
                </Text>
                )}
                
                { token && balance && balance.isFinite() && (
                    <Text fontSize="14px" fontStyle="bold" mt="8px" textAlign="center">
                        {t('Claimable : %amount% %currency%', {amount: getFullDisplayBalance(balance, token.decimals), currency:token.symbol})}
                    </Text>
                )}
                { showBuy && (
                    <>
                    <Text fontSize="14px" fontStyle="bold" mt="8px">
                        {t('Amount (max: %amount% %currency%)', {amount: getFullDisplayBalance(maxNumber), currency:'CRO'})}
                    </Text>
                    <Flex position="relative">
                        <StyledNumericalInput
                            value={value}
                            onUserInput={(val) => setValue(val)} />
                        <Button scale="xs" style={{position: 'absolute', right: '12px', top: '10px'}} onClick={handleClickMax}>{t('MAX')}</Button>
                    </Flex>
                    <Flex justifyContent="center" mt="8px">
                        <Button 
                            scale="sm" 
                            disabled={!buyable || pendingTx || !valueNumber || !valueNumber.isFinite() || valueNumber.gte(maxNumber)} 
                            onClick={handleBuy}
                        >
                            { pendingTx ? (<Dots>{t('Purchasing')}</Dots>) : t('Purchase')}
                        </Button>
                    </Flex>
                    </>
                )}
                { showClaim && (
                <Flex justifyContent="center" mt="8px">
                    <Button scale="sm" disabled={pendingTx || !balance || !balance.isFinite() || balance.eq(0)} onClick={handleClaim}>
                        { pendingTx ? (<Dots>{t('Claiming')}</Dots>) : t('Claim')}
                    </Button>
                </Flex>
                )}
            </Flex>
        </>
    )
}

export default SaleActionSection