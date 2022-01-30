import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Message, Progress, Button, Heading, Skeleton } from '@pancakeswap/uikit'
import { StyledNumericalInput } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import useInterval from 'hooks/useInterval'
import useToast from 'hooks/useToast'
import { useTokenBalance } from 'state/wallet/hooks'
import { BIG_TEN } from 'utils/bigNumber'
import { BigNumber} from 'bignumber.js'
import SaleTimer from './SaleTimer'
import { PublicSaleData } from '../../types'
import { useCancelSale, useDepositeSale } from '../../hooks/useDepositeSale'
import { useFinalizeSale } from '../../hooks/useBuySale'

export interface SaleActionSectionProps {
    sale: PublicSaleData
    account: string
    onReloadSale?: () => void
}

const SaleManageSection: React.FC<SaleActionSectionProps> = ({account, sale, onReloadSale}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [closed, setClosed] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const [depositing, setDepositing] = useState(false)
    const [canceling, setCanceling] = useState(false)
    const token = useToken(sale.token)
    const balanceAmount = useTokenBalance(sale.address, token)
    const balanceTokenNumber = balanceAmount && token ? new BigNumber(balanceAmount.toExact()).multipliedBy(BIG_TEN.pow(token.decimals)) : null;
    const capTokenNumber = sale.cap.multipliedBy(sale.rate)
    const raisedTokenNumber = sale.weiRaised.multipliedBy(sale.rate)
    const requiredTokenNumber = capTokenNumber.minus(raisedTokenNumber)

    const { onDeposite } = useDepositeSale(sale.token)

    const { onFinalize } = useFinalizeSale(sale.address)

    const { onCancel } = useCancelSale(sale.address)


    useInterval(() => {
        const now = Math.floor(new Date().getTime() / 1000);
        if (now > sale.closingTime) {
            setClosed(true)
        } else {
            setClosed(false)
        }
    }, 1000)

    const handleDeposit = useCallback(async () => {
        try {
            setDepositing(true)
            const amount = requiredTokenNumber.minus(balanceTokenNumber)
            const receipt = await onDeposite(amount.toString(), sale.address)
            onReloadSale()
            toastSuccess(
            `${t('Deposited')}!`,
            t('You have been deposited %amount% %symbol% successfully', {
                amount: getFullDisplayBalance(amount, token.decimals),
                symbol: token.symbol
            }),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setDepositing(false)
        }
    }, [toastError, toastSuccess, t, onDeposite, onReloadSale, balanceTokenNumber, requiredTokenNumber, token, sale.address])

    const handleFinalize = useCallback(async () => {
        try {
            setPendingTx(true)
            const receipt = await onFinalize()
            onReloadSale()
            toastSuccess(
            `${t('Finalized')}!`,
            t('This sale has been finalized'),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setPendingTx(false)
        }
    }, [toastError, toastSuccess, t, onFinalize, onReloadSale])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            const receipt = await onCancel()
            onReloadSale()
            toastSuccess(
            `${t('Success')}!`,
            t('This sale has been canceled'),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setCanceling(false)
        }
    }, [toastError, toastSuccess, t, onCancel, onReloadSale])

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
                { !closed && !sale.finalized && token && balanceAmount && balanceTokenNumber.lt(requiredTokenNumber) && (
                    <>
                    <Heading fontSize="20px" color="red" textAlign="center">
                        {t('Complete your setup by depositing %amount% %symbol%!', {amount: getFullDisplayBalance(capTokenNumber.minus(balanceTokenNumber), token.decimals), symbol: token.symbol})}
                    </Heading>

                    <Flex justifyContent="center" mt="16px" mb="16px">
                        <Button disabled={depositing}
                            onClick={handleDeposit}>{ depositing ? (<Dots>{t('Depositing')}</Dots>) : t('Deposit')}</Button>
                    </Flex>
                    </>
                )}
                <Flex justifyContent="center" mb="8px">
                    { balanceAmount ? (
                        <Text fontSize="16px" mr="8px">
                            {balanceAmount.toExact()} {balanceAmount.token.symbol}
                        </Text>
                    ) : (
                        <Skeleton width="60px" height="30px" mr="8px"/>
                    )}
                    <Text fontSize='16px' textAlign="center">
                        {t('remaining')}
                    </Text>
                </Flex>
                { sale.canceled ? (
                    <Flex justifyContent="center" mt="16px" mb="16px">
                        <Text fontSize="16px">
                            { t('Canceled') }
                        </Text>
                    </Flex>
                ) : (
                    <>
                    {
                        closed ? (
                            <>
                            {
                                sale.finalized ? (
                                    <Flex justifyContent="center" mt="16px" mb="16px">
                                        <Text fontSize="16px">
                                            { t('Finalized') }
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Flex justifyContent="center" mt="16px" mb="16px">
                                        <Text fontSize="16px">
                                            { t('Closed') }
                                        </Text>
                                    </Flex>
                                )
                            }
                            </>
                        ) : (
                            <SaleTimer startTime={sale.openingTime} endTime={sale.closingTime} />
                        )
                    }
                    </>
                )}
                <Flex flexDirection="column" mt="8px" mb="16px">
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
                { !sale.canceled && closed && !sale.finalized && (
                    <Flex justifyContent="center" mt="16px" mb="16px">
                        <Button disabled={pendingTx} onClick={handleFinalize}>
                            { pendingTx ? (<Dots>{t('Finalizing')}</Dots>) : t('Finalize')}
                        </Button>
                    </Flex>
                )}
                { !sale.canceled && !closed && sale.weiRaised.eq(0) && (
                    <Flex justifyContent="center" mt="16px" mb="16px">
                        <Button disabled={canceling} onClick={handleCancel}>
                            { canceling ? (<Dots>{t('Canceling')}</Dots>) : t('Cancel')}
                        </Button>
                    </Flex>
                )}
            </Flex>
        </>
    )
}

export default SaleManageSection