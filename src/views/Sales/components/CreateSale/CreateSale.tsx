import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Box, Input, Heading, Button, Radio, useModal } from '@pancakeswap/uikit'
import { JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { useSaleDeployFee } from 'state/launchpad/hooks'
import { fetchLaunchpadPublicDataAsync, fetchLaunchpadUserDataAsync } from 'state/launchpad'
import Select from 'components/Select/Select'
import { StyledInput, StyledInputStyles, StyledIntegerInput, StyledInputLabel, StyledAddressInput, StyledNumericalInput, StyledTextInput } from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getCrowpadSaleFactoryAddress } from 'utils/addressHelpers'
import { isAddress } from 'utils'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import RadioWithText from 'components/Launchpad/RadioWithText'
import { DatePicker } from 'components/DatePicker'
import { OwnerType, TokenType, UnlockType } from '../../types'
import DesclaimerModal from './DesclaimerModal'
import { useCreateSale } from '../../hooks/useCreateSale'

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

interface CreateProps {
    onDisagree: () => void
}

const CreateSale: React.FC<CreateProps> = ({onDisagree}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const history = useHistory()
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [ agreed, setAgreed ] = useState<boolean>(false)
    const [ presentedDesclaimer, setPresentedDesclaimer ] = useState<boolean>(false)
    const [ logo, setLogo ] = useState<string>('')
    const [ rate, setRate ] = useState<string>('')
    const [ softCap, setSoftCap ] = useState<string>('')
    const [ hardCap, setHardCap ] = useState<string>('')
    const [ contributionLimit, setContributionLimit ] = useState<string>('')
    const [ lpPercent, setLpPercent ] = useState<string>('')
    const [ swapRate, setSwapRate ] = useState<string>('')
    const [startDate, setStartDate] = useState<Date|null>(null)
    const [endDate, setEndDate] = useState<Date|null>(null)
    const [wallet, setWallet] = useState<string|null>(null)
    const [lockDate, setLockDate] = useState<Date|null>(null)
    const deployFee = useSaleDeployFee()

    const hardCapNumber = new BigNumber(hardCap).multipliedBy(BIG_TEN.pow(18))
    const { onCreateSale } = useCreateSale()

    const [tokenAddress, setTokenAddress] = useState<string>('')
    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)

    const rateNumber = useMemo(() => {
        const res = new BigNumber(rate)
        if (!searchToken || !res || !res.isFinite() || res.eq(0)) {
            return BIG_ZERO
        }

        return res.multipliedBy(BIG_TEN.pow(searchToken.decimals)).div(BIG_TEN.pow(18))
    }, [rate, searchToken])

    const softCapNumber = useMemo(() => {
        const res = new BigNumber(softCap).multipliedBy(BIG_TEN.pow(18))
        if (!res || !res.isFinite() || res.eq(0)) {
            return BIG_TEN.pow(15)
        }
        return res
    }, [softCap])

    const depositAmoutNumber = useMemo(() => {
        if (!rateNumber || !hardCapNumber || !hardCapNumber.isFinite()) {
            return BIG_ZERO
        }
        return hardCapNumber.multipliedBy(rateNumber)
    }, [rateNumber, hardCapNumber])

    const [approval, approveCallback] = useApproveCallback(searchToken && depositAmoutNumber && depositAmoutNumber.isFinite() ? new TokenAmount(searchToken, JSBI.BigInt(depositAmoutNumber.toJSON())) : undefined, getCrowpadSaleFactoryAddress())

    const [onPresentDesclaimer] = useModal(
        <DesclaimerModal onAgree={() => {
            setAgreed(true)
        }} onCancel={onDisagree}/>,
        false,
        false
    )

    useEffect(() => {
        if (!agreed && !presentedDesclaimer) {
            setPresentedDesclaimer(true)
            onPresentDesclaimer()
        }
        
    }, [agreed, presentedDesclaimer, onPresentDesclaimer])

    const handleStartDateChange = (date: Date, event) => {
        setStartDate(date)
    }

    const handleEndDateChange = (date: Date, event) => {
        setEndDate(date)
    }

    const handleLockDateChange = (date: Date, event) => {
        setLockDate(date)
    }

    const handleCreate = useCallback(async () => {
        try {
            setPendingTx(true)
            const saleAddress = await onCreateSale(deployFee, wallet, searchToken.address, rateNumber.toJSON(), softCapNumber.toJSON(), hardCapNumber.toJSON(), Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000), logo.trim())
            dispatch(fetchLaunchpadPublicDataAsync())
            dispatch(fetchLaunchpadUserDataAsync({account}))
            history.push(`/presale/${saleAddress}`)
            // onPresentSuccess()
        } catch (e) {
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          console.error(e)
        } finally {
          setPendingTx(false)
        }
    }, [onCreateSale, dispatch, toastError, t, history, account, deployFee, wallet, searchToken, rateNumber, softCapNumber, hardCapNumber, startDate, endDate, logo])

    const renderApprovalOrCreateButton = () => {
        return  (
            <Button
            disabled={ pendingTx || !searchToken || !rateNumber || !rateNumber.isFinite() || rateNumber.eq(0) || !softCapNumber || !softCapNumber.isFinite() || softCapNumber.eq(0) || !hardCapNumber || !hardCapNumber.isFinite() || hardCapNumber.eq(0) || softCapNumber.gte(hardCapNumber) || !depositAmoutNumber || !depositAmoutNumber.isFinite() || depositAmoutNumber.eq(0) || !startDate || !endDate || startDate <= new Date() || startDate >= endDate || !isAddress(wallet) }
            onClick={handleCreate}
            width="100%"
            >
            {pendingTx ? (<Dots>{t('Creating')}</Dots>) : t('Create')}
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
                                    placeholder={t('Token Address')}
                                    onUserInput={(value) => setTokenAddress(value)} />
                            </InputWrap>
                            { searchToken && (
                                <>
                                <Flex flexDirection="column">
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token name')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.name} </Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token symbol')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.symbol} </Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token decimals')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.decimals} </Text>
                                    </Flex>
                                    { balance && (
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="8px">{t('Balance')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{getFullDisplayBalance(balance, searchToken.decimals)}</Text>
                                    </Flex>
                                    )}
                                </Flex>
                                </>
                            )}
                            <InputWrap>
                                <StyledAddressInput 
                                    value={wallet} 
                                    placeholder={t('Wallet Address')}
                                    onUserInput={(value) => setWallet(value)} />
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput placeholder={t('Presale Rate, ex. 500')} value={rate} onUserInput={(value) => setRate(value)}/>
                                <StyledInputLabel>
                                    {t('Enter your presale price in CRO: (If I pay 1 CRO, how many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <Flex>
                                    <StyledNumericalInput placeholder={t('Soft Cap ex.50')} style={{marginRight: "4px"}} value={softCap} onUserInput={(value) => setSoftCap(value)}/>
                                    <StyledNumericalInput placeholder={t('Hard Cap ex.100')} style={{marginLeft: "4px"}} value={hardCap} onUserInput={(value) => setHardCap(value)}/>
                                </Flex>
                                <StyledInputLabel>
                                    {t('Enter your desired softcap and hardcap: [soft,hard] (For a small or near 0 soft cap set your softcap to 0.001)')}
                                </StyledInputLabel>
                                
                            </InputWrap>
                            {/* <InputWrap>
                                <StyledIntegerInput placeholder={t('Contribution Limits')} value={contributionLimit} onUserInput={(value) => setContributionLimit(value)} />
                                <StyledInputLabel>
                                    {t('Enter the maximum amounts each wallet can contribute: (max)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledIntegerInput placeholder={t('CrowFi Swap Liquidity, ex. 60')} value={lpPercent} onUserInput={(value) => setLpPercent(value)}/>
                                <StyledInputLabel>
                                    {t('Enter the percentage of raised funds that should be allocated to Liquidity on CrowFi Swap (Min 51%)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput placeholder={t('CrowFi Swap Rate ex.400')} value={swapRate} onUserInput={(value) => setSwapRate(value)} />
                                <StyledInputLabel>
                                    {t('Enter CrowFi Swap listing price in CRO: (If I buy 1 CRO worth on CrowFi Swap how many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap> */}
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleStartDateChange}
                                selected={startDate}
                                placeholderText="Presale Start Time"/>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleEndDateChange}
                                selected={endDate}
                                placeholderText="Presale End Time"/>
                            </InputWrap>
                            <InputWrap>
                                <StyledTextInput
                                    value={logo} 
                                    placeholder={t('Logo')}
                                    onUserInput={(value) => setLogo(value)} />
                                <StyledInputLabel>
                                    {t('Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif))')}
                                </StyledInputLabel>
                            </InputWrap>
                            {/* <InputWrap>
                                <DateTimePikcer 
                                onChange={handleLockDateChange}
                                selected={lockDate}
                                placeholderText="Liquidity Lockup Time"/>
                            </InputWrap> */}

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrCreateButton()}
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            <Heading color="primary" mt="8px">
                                {t('CrowFi Presale:')}
                            </Heading>
                            <StyledList>
                                <li>
                                {t('This process is entirely decentralized, we cannot be held responsible for incorrect entry of information or be held liable for anything related to your use of our platform.')}
                                </li>
                                
                            </StyledList>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateSale