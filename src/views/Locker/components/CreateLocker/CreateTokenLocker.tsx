import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex,  Heading, Button, Skeleton, useModal } from '@pancakeswap/uikit'
import { ETHER, JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import { StyledInput, StyledAddressInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import { useAppDispatch } from 'state'
import { fetchLockerPublicDataAsync, fetchLockerUserDataAsync } from 'state/locker'
import useTheme from 'hooks/useTheme'
import { useToken, usePairToken } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { isAddress } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { BIG_TEN } from 'utils/bigNumber'
import { getLockerAddress } from 'utils/addressHelpers'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import RadioWithText from 'components/Launchpad/RadioWithText'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import BigNumber from 'bignumber.js'
import { LockType } from 'state/types'
import { useLockerFee } from 'state/locker/hooks'
import SuccessModal from './SuccessModal'
import { OwnerType } from '../../types'
import { useCreateLock } from '../../hooks/useCreateLock'

const InputWrap = styled.div`
    padding: 8px 0px;
`
const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

const StyledList = styled.ul`
    margin-top: 16px;
    color: ${({ theme }) => theme.colors.secondary};
    list-style: none;
    font-size: 14px;
    line-height: 1.2;
    > li {
        margin-top: 8px;
        position: relative;
        padding-left: 16px;
        ::before {
            content: '-';
            position: absolute;
            left: 0;
        }
    }
`

const CreateTokenLocker: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const lockerFee = useLockerFee()
    const lockerFeeNumber = new BigNumber(lockerFee)
    const { toastError, toastSuccess } = useToast()
    const [ownerType, setOwnerType] = useState<OwnerType>(OwnerType.ME)
    const [unlockDate, setUnlockDate] = useState<Date|null>(null)
    const [amount, setAmount] = useState<string|null>(null)
    const [otherAddress, setOtherAddress] = useState<string>('')
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [pendingTx, setPendingTx] = useState(false)
    const searchToken = useToken(tokenAddress)
    const searchPair = undefined
    const token0 = useToken(searchPair ? searchPair.token0Address : null)
    const token1 = useToken(searchPair ? searchPair.token1Address : null)
    const amountNumber = useMemo(() => {
        const res = searchToken ? new BigNumber(amount).multipliedBy(BIG_TEN.pow(searchToken.decimals)) : null
        return res
    }, [amount, searchToken])
    const type = useMemo(() => {
        if (searchPair) return LockType.LIQUIDITY
        if (searchToken) return LockType.NORMAL
        return LockType.UNKNOWN
    }, [searchPair, searchToken])
    const [approval, approveCallback] = useApproveCallback(searchToken && amountNumber && amountNumber.isFinite() ? new TokenAmount(searchToken, JSBI.BigInt(amountNumber.toJSON())) : undefined, getLockerAddress())
    const {balance} = useTokenBalance(searchToken ? searchToken.address : undefined)

    const { onCreateLock } = useCreateLock()

    const handleUnlockDateChange = (date: Date, event) => {
        setUnlockDate(date)
    }

    const onPercentClick = (percent: number) => {
        if (balance && searchToken) {
            if (percent === 100) {
                setAmount(getFullDisplayBalance(balance, searchToken.decimals, searchToken.decimals))
            } else {
                setAmount(getFullDisplayBalance(balance.multipliedBy(percent).div(100), searchToken.decimals, searchToken.decimals))
            }
        }
    }

    const clearForm = () => {
        setTokenAddress('')
        setUnlockDate(null)
        setAmount('')
        setOwnerType(OwnerType.ME)
    }

    const renderDeployFee = () => {
        if (lockerFeeNumber && lockerFeeNumber.isFinite()) {
            return (
                <Text fontSize='12px' color="secondary">
                    {getFullDisplayBalance(lockerFeeNumber, ETHER.decimals)} {ETHER.symbol}
                </Text>
            )
        } 

        return <Skeleton width="100px" height="30px" />
    }


    const [onPresentSuccess] = useModal(
        <SuccessModal
            token={searchToken}
            lockedAmount={amountNumber}
            unlockAt={unlockDate}
            type={type}
            customOnDismiss={clearForm}/>,
        false,
        false,
        "CreateLockSuccessModal"
      )

    const handleCreate = useCallback(async () => {
        try {
            setPendingTx(true)
            const owner = ownerType === OwnerType.ME ? account : otherAddress
            await onCreateLock(lockerFee, owner, searchToken.address, type === LockType.LIQUIDITY, amountNumber.toJSON(), Math.floor(unlockDate.getTime() / 1000))
            dispatch(fetchLockerPublicDataAsync())
            dispatch(fetchLockerUserDataAsync({account}))
            onPresentSuccess()
        } catch (e) {
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          console.error(e)
        } finally {
          setPendingTx(false)
        }
      }, [onCreateLock, onPresentSuccess, dispatch, toastError, t, account, type, searchToken, amountNumber, unlockDate, ownerType, otherAddress, lockerFee])

    const renderTokenInfo = () => {
        if (searchPair) {
            return (
                <Flex flexDirection="column">
                    <Flex>
                        <Text fontSize="14px" color="secondary" mr="24px">{t('Pair')}: </Text>
                        { token0 && token1 ? (
                            <Text fontSize="14px" bold color="primary">{token0.symbol} / {token1.symbol} </Text>
                        ) : (
                            <Skeleton width="100px" height="24px" />
                        )}
                    </Flex>
                    { balance && searchToken && (
                    <Flex>
                        <Text fontSize="14px" color="secondary" mr="8px">{t('Balance')}: </Text>
                        <Text fontSize="14px" bold color="primary">{getFullDisplayBalance(balance, searchToken.decimals)}</Text>
                    </Flex>
                    )}
                </Flex>
            )
        }

        if (searchToken) {
            return (
                <Flex flexDirection="column">
                    <Flex>
                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token')}: </Text>
                        <Text fontSize="14px" bold color="primary">{searchToken.name} </Text>
                    </Flex>
                    { balance && (
                    <Flex>
                        <Text fontSize="14px" color="secondary" mr="8px">{t('Balance')}: </Text>
                        <Text fontSize="14px" bold color="primary">{getFullDisplayBalance(balance, searchToken.decimals)}</Text>
                    </Flex>
                    )}
                </Flex>
            )
        }
        return null
    }

    const renderApprovalOrCreateButton = () => {
        return approval === ApprovalState.APPROVED ? (
            <Button
            disabled={ pendingTx || !searchToken || !amountNumber || !amountNumber.isFinite() || amountNumber.eq(0) || (ownerType === OwnerType.OTHER && !isAddress(otherAddress))}
            onClick={handleCreate}
            width="100%"
            >
            {pendingTx ? (<Dots>{t('Creating')}</Dots>) : t('Create')}
            </Button>
        ) : (
            <Button mt="8px" width="100%"  disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
                {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
            </Button>
        )
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledAddressInput 
                                    value={tokenAddress} 
                                    placeholder={t('Enter Token or LP Token Address')}
                                    onUserInput={(value) => setTokenAddress(value)} />
                            </InputWrap>
                            {renderTokenInfo()}
                            
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleUnlockDateChange}
                                selected={unlockDate}
                                placeholderText="Unlock Time"/>
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput placeholder={t('Enter amount of token to lock')} value={amount} onUserInput={(val) => setAmount(val)}/>
                                <Flex justifyContent="space-between" mt="4px">
                                    <Button disabled={!balance || !searchToken} scale="sm" variant="tertiary" onClick={() => onPercentClick(25)}>
                                        25%
                                    </Button>
                                    <Button disabled={!balance || !searchToken} scale="sm" variant="tertiary" onClick={() => onPercentClick(50)}>
                                        50%
                                    </Button>
                                    <Button disabled={!balance || !searchToken} scale="sm" variant="tertiary" onClick={() => onPercentClick(75)}>
                                        75%
                                    </Button>
                                    <Button disabled={!balance || !searchToken} scale="sm" variant="tertiary" onClick={() => onPercentClick(100)}>
                                        MAX
                                    </Button>
                                </Flex>
                            </InputWrap>
                            <InputWrap>
                                <Flex flexDirection="column">
                                    <Text color="primary" fontSize='14px'>
                                        {t('Select Locker Owner?')}
                                    </Text>
                                    <RadioWithText
                                        onClick={() => setOwnerType(OwnerType.ME)}
                                        text={t('Myself')}
                                        checked={ownerType === OwnerType.ME}
                                    />
                                    <RadioWithText
                                        onClick={() => setOwnerType(OwnerType.OTHER)}
                                        text={t('Someone else')}
                                        checked={ownerType === OwnerType.OTHER}
                                    />
                                </Flex>
                                { ownerType === OwnerType.OTHER && (
                                    <InputWrap>
                                        <StyledAddressInput 
                                            value={otherAddress} 
                                            placeholder={t('Enter owner wallet address')}
                                            onUserInput={(value) => setOtherAddress(value)} />
                                    </InputWrap>
                                )}
                                
                            </InputWrap>

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrCreateButton()}
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                        <Heading color="primary" mt="8px">
                            {t('CrowFi Locker:')}
                        </Heading>
                        <StyledList>
                            <li>
                            {t('Use the CrowFi Locker to lock your tokens or lp tokens, and earn greater trust within your community!')}
                            </li>
                            
                        </StyledList>

                        <Flex mt="24px" alignItems="center">
                            <Text fontSize='12px' color="secondary" mr="12px">{t('Lock fee')}:</Text>
                            {renderDeployFee()}
                        </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateTokenLocker