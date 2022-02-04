import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex,  Message, Progress, Button, useModal, Heading } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { StyledInputLabel, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import useToast from 'hooks/useToast'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DeserializedLock } from 'state/types'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import Dots from 'components/Loader/Dots'
import UnlockTimer from './UnlockTimer'
import { useEditLock, useUnlock } from '../../hooks/useCreateLock'

const InputWrap = styled.div`
    padding: 8px 0px;
`

const LoadingWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
`

export interface LockerActionSectionProps {
    token?: Token
    lock?: DeserializedLock
    account?: string
    updateLock?: (DeserializedLock) => void
}

const LockerActionSection: React.FC<LockerActionSectionProps> = ({token, lock, account, updateLock}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [unlockDate, setUnlockDate] = useState<Date|null>()
    const [amount, setAmount] = useState<string|null>()
    const [pendingTx, setPendingTx] = useState(false)
    const [pendingUnlock, setPendingUnlock] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const currentBlockTimestamp = useCurrentBlockTimestamp()
    const { onEditLock } = useEditLock()
    const { onUnlock } = useUnlock()
    const amountNumber = useMemo(() => {
        const res = token ? new BigNumber(amount).multipliedBy(BIG_TEN.pow(token.decimals)) : null
        return res
    }, [amount, token])

    useEffect(() => {
        if (lock && token && !initialized) {
            setUnlockDate(new Date(lock.unlockDate * 1000))
            setAmount(getFullDisplayBalance(lock.amount, token.decimals))
            setInitialized(true)
        }
    }, [lock, token, initialized])


    const handleUnlockDateChange = (date: Date, event) => {
        setUnlockDate(date)
    }

    const handleUnlock = useCallback(async() => {
        try {
            setPendingUnlock(true)
            const receipt = await onUnlock(lock.id)
            toastSuccess(
                t('Unlocked!'),
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    {t('Your lock has been unlocked successfully')}
                </ToastDescriptionWithTx>,
            )
            updateLock({
                ...lock,
                amount: BIG_ZERO,
            })
        } catch (e) {
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        } finally {
            setPendingUnlock(false)
        }
        
    }, [onUnlock, t, toastSuccess, toastError, updateLock, lock])

    const handleEdit = useCallback(async() => {
        try {
            setPendingTx(true)
            const receipt = await onEditLock(lock.id, amountNumber.toJSON(), unlockDate.getTime() / 1000)
            toastSuccess(
                t('Updated!'),
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                    {t('Your lock has been updated')}
                </ToastDescriptionWithTx>,
            )
            updateLock({
                ...lock,
                amount: amountNumber,
                unlockDate: unlockDate.getTime() / 1000
            })
        } catch (e) {
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        } finally {
            setPendingTx(false)
        }
        
    }, [onEditLock, t, toastSuccess, toastError, updateLock, lock, amountNumber, unlockDate])

    return (
        <>
            <Flex flexDirection="column" width="100%" position="relative">
                { pendingTx && (
                    <LoadingWrapper/>
                )}
                
                <Message variant="warning" mb="24px">
                    <Text>
                    {t(
                        "Make sure the website is crowfi.app!",
                    )}
                    </Text>
                </Message>
                
                { lock && lock.amount.eq(BIG_ZERO) && (
                    <Heading textAlign="center" mb="8px" color="primary">
                        {t('UNLOCKED!')}
                    </Heading>
                )}
                { lock && lock.amount.gt(BIG_ZERO) && (
                    <UnlockTimer endTime={lock.unlockDate} />
                )}

                { lock && lock.owner === account && lock.amount.gt(BIG_ZERO) && (
                <Flex justifyContent="center" mt="16px">
                    <Button 
                        disabled={pendingUnlock || !currentBlockTimestamp || !lock || lock.unlockDate > currentBlockTimestamp.toNumber()}
                        onClick={handleUnlock}>
                        {t('Unlock')}
                    </Button>
                </Flex>
                )}

                { lock && lock.owner === account && lock.amount.gt(BIG_ZERO) && (
                    <Flex flexDirection="column" mt="16px" borderTop="1px solid rgba(0,0,0, 0.2)" paddingTop="16px">
                    <InputWrap>
                        <StyledInputLabel>
                            {t('New Unlock Time')}
                        </StyledInputLabel>
                        <DateTimePikcer 
                        onChange={handleUnlockDateChange}
                        selected={unlockDate}
                        placeholderText="New Unlock Time"/>
                    </InputWrap>
                    <InputWrap>
                        <StyledInputLabel>
                            {t('Amount of tokens to lock more')}
                        </StyledInputLabel>
                        <StyledNumericalInput placeholder={t('Enter amount of token to lock more')} value={amount} onUserInput={(val) => setAmount(val)}/>
                    </InputWrap>
                    <Flex justifyContent="center" mt="16px">
                        <Button disabled={pendingTx || !unlockDate || lock.unlockDate > unlockDate.getTime() / 1000 || !amountNumber || !amountNumber.isFinite() || amountNumber.lt(lock.amount)}
                            onClick={handleEdit}>
                            { pendingTx ? (<Dots>{t('Updating')}</Dots>): t('Update Lock')}
                        </Button>
                    </Flex>
                    </Flex>
                )}

            </Flex>
        </>
    )
}

export default LockerActionSection