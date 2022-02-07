import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Box, Input, Heading, Button, Radio, useModal, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { useAppDispatch } from 'state'
import { useSaleDeployFee } from 'state/launchpad/hooks'
import { fetchLaunchpadPublicDataAsync, fetchLaunchpadUserDataAsync } from 'state/launchpad'
import { StyledAddressInput, StyledNumericalInput, StyledTextInput, StyledWrapperWithTooltip } from 'components/Launchpad/StyledControls'
import RadioWithText from 'components/Launchpad/RadioWithText'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { getCrowpadSaleFactoryAddress } from 'utils/addressHelpers'
import { isAddress } from 'utils'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Dots from 'components/Loader/Dots'
import ConnectWalletButton from 'components/ConnectWalletButton'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import DesclaimerModal from './DesclaimerModal'
import { useCreateSale } from '../../hooks/useCreateSale'

const InputWrap = styled.div`
    padding: 8px 4px;
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

interface FormErrors {
    token?: string,
    wallet?: string,
    rate?: string,
    listingRate?: string,
    liquidityPercent?: string,
    softCap?: string,
    hardCap?: string,
    minContribution?: string,
    maxContribution?: string,
    presaleStartTime?: string,
    presaleEndTime?: string,
    unlockDate?: string
    logo?: string
}

interface CreateProps {
    routeAddress?: string
    onDisagree: () => void
}

const CreateSale: React.FC<CreateProps> = ({onDisagree, routeAddress}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const history = useHistory()
    const usdcToken: Token = tokens.usdc
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [ agreed, setAgreed ] = useState<boolean>(false)
    const [ useUSDC, setUseUSDC ] = useState<boolean>(false)
    const [ presentedDesclaimer, setPresentedDesclaimer ] = useState<boolean>(false)
    const [ logo, setLogo ] = useState<string>('')
    const [ rate, setRate ] = useState<string>('')
    const [ listingRate, setListingRate ] = useState<string>('')
    const [ liquidityPercent, setLiquidityPercent ] = useState<string>('')
    const [ softCap, setSoftCap ] = useState<string>('')
    const [ hardCap, setHardCap ] = useState<string>('')
    const [ minContribution, setMinContribution ] = useState<string>('')
    const [ maxContribution, setMaxContribution ] = useState<string>('')
    const [startDate, setStartDate] = useState<Date|null>(null)
    const [endDate, setEndDate] = useState<Date|null>(null)
    const [unlockDate, setUnlockDate] = useState<Date|null>(null)
    const [wallet, setWallet] = useState<string|null>(null)
    const [formError, setFormError] = useState<FormErrors>({})
    const [whitelistEnabled, setWhitelistEnabled] = useState<boolean>(false)
    const {
        targetRef: whitelistTargetRef,
        tooltip: whitelistTooltipElement,
        tooltipVisible: whitelistTooltipVisible,
      } = useTooltip("In a private sale, only whitelisted investors can contribute.", {
        placement: 'bottom',
      })
    const {
        targetRef: purchaseTypeTargetRef,
        tooltip: purchaseTypeTooltipElement,
        tooltipVisible: purchaseTypeTooltipVisible,
    } = useTooltip("Your investors can contribute with $CRO or $USDC", {
        placement: 'bottom',
    })
    const deployFee = useSaleDeployFee()
    const baseTokenDecimals = useMemo(() => {
        return useUSDC ? usdcToken.decimals : 18;
    }, [useUSDC, usdcToken])

    const minContributionNumer = new BigNumber(minContribution).multipliedBy(BIG_TEN.pow(baseTokenDecimals))
    const maxContributionNumer = new BigNumber(maxContribution).multipliedBy(BIG_TEN.pow(baseTokenDecimals))
    const { onCreateSale } = useCreateSale()

    const [tokenAddress, setTokenAddress] = useState<string>('')
    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)

    const rateDecimalsNumber = useMemo(() => {
        const res = new BigNumber(rate)
        if (!searchToken || !res || !res.isFinite() || res.eq(0)) {
            return BIG_ZERO
        }
        if (baseTokenDecimals < searchToken.decimals) {
            return new BigNumber(res.decimalPlaces())
        }
        return new BigNumber(res.decimalPlaces() + baseTokenDecimals - searchToken.decimals)
    }, [rate, searchToken, baseTokenDecimals])

    const rateNumber = useMemo(() => {
        const res = new BigNumber(rate)
        if (!searchToken || !res || !res.isFinite() || res.eq(0)) {
            return BIG_ZERO
        }

        if (baseTokenDecimals < searchToken.decimals) {
            return res.multipliedBy(BIG_TEN.pow(res.decimalPlaces() + searchToken.decimals - baseTokenDecimals))
        }

        return res.multipliedBy(BIG_TEN.pow(res.decimalPlaces()))
    }, [rate, searchToken, baseTokenDecimals])

    const listingRateDecimalsNumber = useMemo(() => {
        const res = new BigNumber(listingRate)
        if (!searchToken || !res || !res.isFinite() || res.eq(0)) {
            return BIG_ZERO
        }
        if (baseTokenDecimals < searchToken.decimals) {
            return new BigNumber(res.decimalPlaces())
        }
        return new BigNumber(res.decimalPlaces() + baseTokenDecimals - searchToken.decimals)
    }, [listingRate, searchToken, baseTokenDecimals])

    const listingRateNumber = useMemo(() => {
        const res = new BigNumber(listingRate)
        if (!searchToken || !res || !res.isFinite() || res.eq(0)) {
            return BIG_ZERO
        }

        if (baseTokenDecimals < searchToken.decimals) {
            return res.multipliedBy(BIG_TEN.pow(res.decimalPlaces() + searchToken.decimals - baseTokenDecimals))
        }

        return res.multipliedBy(BIG_TEN.pow(res.decimalPlaces()))
    }, [listingRate, searchToken, baseTokenDecimals])

    const liquidityPercentNumber = useMemo(() => {
        return new BigNumber(liquidityPercent)
    }, [liquidityPercent])

    const softCapNumber = useMemo(() => {
        const res = new BigNumber(softCap).multipliedBy(BIG_TEN.pow(baseTokenDecimals))
        if (res && res.isFinite() && res.lte(BIG_TEN.pow(baseTokenDecimals - 3))) {
            return BIG_TEN.pow(baseTokenDecimals - 3)
        }
        return res
    }, [softCap, baseTokenDecimals])

    const hardCapNumber = useMemo(() => {
        return new BigNumber(hardCap).multipliedBy(BIG_TEN.pow(baseTokenDecimals))
    }, [hardCap, baseTokenDecimals])

    const presaleAmountNumber = useMemo(() => {
        if (!rateNumber || !rateNumber.isFinite() || !hardCapNumber || !hardCapNumber.isFinite()) {
            return BIG_ZERO
        }

        return hardCapNumber.multipliedBy(rateNumber).div(BIG_TEN.pow(rateDecimalsNumber))
    }, [rateNumber, rateDecimalsNumber, hardCapNumber])

    const liquidityAmountNumber = useMemo(() => {
        if (!listingRateNumber || !listingRateNumber.isFinite() || !liquidityPercentNumber || !liquidityPercentNumber.isFinite() || !hardCapNumber || !hardCapNumber.isFinite()) {
            return BIG_ZERO
        }

        return hardCapNumber.multipliedBy(liquidityPercentNumber).div(100).multipliedBy(listingRateNumber).div(BIG_TEN.pow(listingRateDecimalsNumber))
    }, [listingRateNumber, listingRateDecimalsNumber, liquidityPercentNumber, hardCapNumber])

    const depositAmountNumber = useMemo(() => {
        if (presaleAmountNumber.eq(0) || liquidityAmountNumber.eq(0)) {
            return BIG_ZERO
        }
        return presaleAmountNumber.plus(liquidityAmountNumber)
    }, [presaleAmountNumber, liquidityAmountNumber])

    const [onPresentDesclaimer] = useModal(
        <DesclaimerModal onAgree={() => {
            setAgreed(true)
        }} onCancel={onDisagree}/>,
        false,
        false
    )

    useEffect(() => {
        if (routeAddress && routeAddress.length > 0 && isAddress(routeAddress)) {
            setTokenAddress(routeAddress)
        }
    }, [routeAddress])

    useEffect(() => {
        if (!agreed && !presentedDesclaimer) {
            setPresentedDesclaimer(true)
            onPresentDesclaimer()
        }
        
    }, [agreed, presentedDesclaimer, onPresentDesclaimer])

    const handleStartDateChange = (date: Date, event) => {
        setStartDate(date)
        setFormError({...formError, presaleStartTime: null})
    }

    const handleEndDateChange = (date: Date, event) => {
        setEndDate(date)
        setFormError({...formError, presaleEndTime: null})
    }

    const handleUnlockDatechange = (date: Date, event) => {
        setUnlockDate(date)
        setFormError({...formError, unlockDate: null})
    }

    const validateInputs = useCallback(() => {
        let valid = true
        const error: FormErrors = {}

        if (!tokenAddress || tokenAddress.length === 0) {
            error.token = "Token address is required.";
            valid = false;
        } else if (!searchToken) {
            valid = false;
            error.token = "Token address is invalid.";
        } else {

            if (!rateNumber || !rateNumber.isFinite() || rateNumber.eq(0)) {
                valid = false;
                error.rate = "Presale rate is required.";
            } else if (!rateDecimalsNumber || !rateDecimalsNumber.isFinite() || rateDecimalsNumber.lt(0)) {
                valid = false;
                error.rate = "Presale rate is invalid .";
            }

            if (!listingRateNumber || !listingRateNumber.isFinite() || listingRateNumber.eq(0)) {
                valid = false;
                error.listingRate = "Listing rate is required.";
            } else if (!listingRateDecimalsNumber || !listingRateDecimalsNumber.isFinite() || listingRateDecimalsNumber.lt(0)) {
                valid = false;
                error.listingRate = "Listing rate is invalid .";
            }

            if (!error.rate && !error.listingRate && listingRateNumber.div(BIG_TEN.pow(listingRateDecimalsNumber)).gte(rateNumber.div(BIG_TEN.pow(rateDecimalsNumber)))) {
                valid = false;
                error.listingRate = "Listing rate must be smaller than presale rate.";
            }


            if (!depositAmountNumber || !depositAmountNumber.isFinite() || depositAmountNumber.eq(0)) {
                valid = false;
                error.maxContribution = "Hard cap is invalid.";
            }
        }

        if (!isAddress(wallet)) {
            valid = false;
            error.wallet = "Wallet address is invalid.";
        }

        if (!liquidityPercentNumber || !liquidityPercentNumber.isFinite() || liquidityPercentNumber.eq(0)) {
            valid = false;
            error.liquidityPercent = "Liquidity percent is required.";
        } else if (liquidityPercentNumber.lt(50) || liquidityPercentNumber.gt(100)) {
            valid = false;
            error.liquidityPercent = "Liquidity percent must be in 50-100.";
        }

        if (!softCapNumber || !softCapNumber.isFinite() || softCapNumber.eq(0)) {
            valid = false;
            error.softCap = "Soft cap is required.";
        }

        if (!hardCapNumber || !hardCapNumber.isFinite() || hardCapNumber.eq(0)) {
            valid = false;
            error.hardCap = "Hard cap is required.";
        }

        if (softCapNumber && hardCapNumber && softCapNumber.gte(hardCapNumber)) {
            valid = false;
            error.softCap = "Soft cap cannot be greater than hard cap.";
        }

        if (!minContributionNumer || !minContributionNumer.isFinite() || minContributionNumer.eq(0)) {
            valid = false;
            error.minContribution = "Min contribution is required.";
        }

        if (!maxContributionNumer || !maxContributionNumer.isFinite() || maxContributionNumer.eq(0)) {
            valid = false;
            error.maxContribution = "Max contribution is required.";
        }

        if (minContributionNumer && maxContributionNumer && minContributionNumer.gte(maxContributionNumer)) {
            valid = false;
            error.softCap = "Min contribution cannot be greater than max contribution.";
        }

        if (!startDate) {
            valid = false;
            error.presaleStartTime = "Presale start date is required.";
        } else if (startDate <= new Date()) {
            valid = false;
            error.presaleStartTime = "Presale start date should be earlier than current time.";
        }

        if (!endDate) {
            valid = false;
            error.presaleEndTime = "Presale start date is required.";
        }

        if (startDate && endDate && startDate >= endDate) {
            valid = false;
            error.presaleEndTime = "Presale end date should be later than presale start date.";
        }

        if (!unlockDate) {
            valid = false;
            error.unlockDate = "Liquidity unlock date is required.";
        } else if (endDate && unlockDate <= endDate) {
            error.unlockDate = "Liquidity unlock date must be later than presale end date.";
        }
        setFormError(error)
        return valid
    }, [wallet, searchToken, rateNumber, rateDecimalsNumber, listingRateNumber, listingRateDecimalsNumber, liquidityPercentNumber, softCapNumber, hardCapNumber, startDate, endDate, unlockDate, minContributionNumer, maxContributionNumer, depositAmountNumber, tokenAddress])


    const handleCreate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }
        try {
            setPendingTx(true)
            const saleAddress = await onCreateSale(deployFee, wallet, searchToken.address, useUSDC ? usdcToken.address : AddressZero, rateNumber.toJSON(), rateDecimalsNumber.toJSON(), listingRateNumber.toJSON(), listingRateDecimalsNumber.toJSON(), liquidityPercentNumber.toJSON(), softCapNumber.toJSON(), hardCapNumber.toJSON(), Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000), Math.floor(unlockDate.getTime() / 1000), minContributionNumer.toJSON(), maxContributionNumer.toJSON(), whitelistEnabled, logo.trim())
            dispatch(fetchLaunchpadPublicDataAsync())
            dispatch(fetchLaunchpadUserDataAsync({account}))
            history.push(`/presale/view/${saleAddress}`)
            // onPresentSuccess()
        } catch (e) {
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          console.error(e)
        } finally {
          setPendingTx(false)
        }
    }, [onCreateSale, dispatch, toastError, t, validateInputs, history, account, deployFee, wallet, searchToken, rateNumber, rateDecimalsNumber, listingRateNumber, listingRateDecimalsNumber, liquidityPercentNumber, softCapNumber, hardCapNumber, startDate, endDate, unlockDate, minContributionNumer, maxContributionNumer, whitelistEnabled, logo, useUSDC, usdcToken])

    const renderApprovalOrCreateButton = () => {
        return  (
            <Button
            disabled={ pendingTx }
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
                                    <Flex  alignItems="center">
                                        <Text color="primary">
                                            {t('Contribution Currency:')}
                                        </Text>
                                        <span ref={purchaseTypeTargetRef}>
                                            <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
                                        </span>
                                        { purchaseTypeTooltipVisible && purchaseTypeTooltipElement}
                                    </Flex>
                                    <Flex>
                                        <Flex flex="1">
                                            <RadioWithText
                                                checked={!useUSDC}
                                                onClick={() => setUseUSDC(false)}
                                                text={t('CRO')}
                                                />
                                        </Flex>
                                        <Flex flex="1">
                                            <RadioWithText
                                                checked={useUSDC}
                                                onClick={() => setUseUSDC(true)}
                                                text={t('USDC')}
                                                />
                                        </Flex>
                                    </Flex>
                                </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    error={formError.token}
                                    >
                                <StyledAddressInput 
                                    value={tokenAddress} 
                                    placeholder={t('Token Address')}
                                    onUserInput={(value) => {
                                        setTokenAddress(value)
                                        setFormError({...formError, token: null})
                                    }} />
                                </StyledWrapperWithTooltip>
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
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter your wallet address which you want to receive %symbol% from your investors.', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                    error={formError.wallet}
                                    >
                                    <StyledAddressInput
                                        value={wallet} 
                                        placeholder={t('Wallet Address')}
                                        onUserInput={(value) => {
                                            setWallet(value)
                                            setFormError({...formError, wallet: null})
                                        }} />
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter your presale price in %symbol%: (If I pay 1 %symbol%, how many tokens do I get?)', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                    error={formError.rate}
                                    >
                                    <StyledNumericalInput placeholder={t('Presale Rate, ex. 500')} value={rate} onUserInput={
                                        (value) => {
                                        setRate(value)
                                        setFormError({...formError, rate: null})
                                    }}/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <Flex flexDirection={["column", null, null, "row"]}>
                                <InputWrap style={{flex: 1}}>
                                    <StyledWrapperWithTooltip
                                        tooltip={t('Enter your desired softcap in %symbol% (For a small or near 0 soft cap set your softcap to 0.001)', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                        error={formError.softCap}
                                            >
                                        <StyledNumericalInput placeholder={t('Soft Cap ex.50 %symbol%', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})} value={softCap} onUserInput={(value) => {
                                            setSoftCap(value)
                                            setFormError({...formError, softCap: null})
                                        } }/>
                                    </StyledWrapperWithTooltip>
                                </InputWrap>
                                <InputWrap style={{flex: 1}}>

                                    <StyledWrapperWithTooltip
                                            tooltip={t('Enter your desired hardcap in %symbol%', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                            error={formError.hardCap}
                                                >
                                        <StyledNumericalInput placeholder={t('Hard Cap ex.100 %symbol%', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})} value={hardCap} onUserInput={(value) => {
                                            setHardCap(value)
                                            setFormError({...formError, hardCap: null})
                                        }}/>
                                    </StyledWrapperWithTooltip>
                                </InputWrap>
                            </Flex>
                            <Flex flexDirection={["column", null, null, "row"]}>
                                <InputWrap style={{flex: 1}}>
                                    <StyledWrapperWithTooltip
                                        tooltip={t('Enter your desired minimum contribution in %symbol%. ex. 0.1 %symbol', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                        error={formError.minContribution}
                                            >
                                        <StyledNumericalInput placeholder={t('Min contribution')} style={{marginRight: "4px"}} value={minContribution} onUserInput={(value) => {
                                            setMinContribution(value)
                                            setFormError({...formError, minContribution: null})
                                        }}/>
                                    </StyledWrapperWithTooltip>
                                </InputWrap>
                                <InputWrap style={{flex: 1}}>
                                    <StyledWrapperWithTooltip
                                        tooltip={t('Enter your desired maximum contribution in %symbol%. ex. 2 %symbol%', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                        error={formError.maxContribution}
                                            >
                                        <StyledNumericalInput placeholder={t('Max Contribution')} style={{marginLeft: "4px"}} value={maxContribution} onUserInput={(value) => {
                                            setMaxContribution(value)
                                            setFormError({...formError, maxContribution: null})
                                        }}/>
                                    </StyledWrapperWithTooltip>
                                </InputWrap>
                            </Flex>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter your desired Liquidity % (50 ~ 100)')}
                                    error={formError.liquidityPercent}
                                        >
                                    <StyledNumericalInput placeholder={t('Liquidity (%)')} value={liquidityPercent} onUserInput={(value) => {
                                        setLiquidityPercent(value)
                                        setFormError({...formError, liquidityPercent: null})
                                    }}/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter your desired listing prce in %symbol%: (If I pay 1 %symbol%, how many tokens do I get?)', {symbol: useUSDC ? usdcToken.symbol : 'CRO'})}
                                    error={formError.listingRate}
                                        >
                                    <StyledNumericalInput placeholder={t('Listing Rate')} value={listingRate} onUserInput={(value) => {
                                        setListingRate(value)
                                        setFormError({...formError, listingRate: null})
                                    }}/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter the presale start time in your local time.')}
                                    error={formError.presaleStartTime}
                                    >
                                    <DateTimePikcer 
                                    onChange={handleStartDateChange}
                                    selected={startDate}
                                    timeIntervals={1}
                                    placeholderText="Presale Start Time"/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter the presale end time in your local time.')}
                                    error={formError.presaleEndTime}
                                    >
                                    <DateTimePikcer 
                                    onChange={handleEndDateChange}
                                    selected={endDate}
                                    timeIntervals={1}
                                    placeholderText="Presale End Time"/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Enter the liquidity unlock time in your local time.')}
                                    error={formError.unlockDate}
                                    >
                                    <DateTimePikcer 
                                    onChange={handleUnlockDatechange}
                                    selected={unlockDate}
                                    timeIntervals={1}
                                    placeholderText="Liquidity Unlock Time"/>
                                </StyledWrapperWithTooltip>
                            </InputWrap>
                            <InputWrap>
                                <Flex  alignItems="center">
                                    <Text color="primary">
                                        {t('Sale type:')}
                                    </Text>
                                    <span ref={whitelistTargetRef}>
                                        <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
                                    </span>
                                    { whitelistTooltipVisible && whitelistTooltipElement}
                                </Flex>
                                <Flex>
                                    <Flex flex="1">
                                        <RadioWithText
                                            checked={!whitelistEnabled}
                                            onClick={() => setWhitelistEnabled(false)}
                                            text={t('Public')}
                                            />
                                    </Flex>
                                    <Flex flex="1">
                                        <RadioWithText
                                            checked={whitelistEnabled}
                                            onClick={() => setWhitelistEnabled(true)}
                                            text={t('Private')}
                                            />
                                    </Flex>
                                </Flex>
                            </InputWrap>
                            <InputWrap>
                                <StyledWrapperWithTooltip
                                    tooltip={t('Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif))')}
                                    error={formError.logo}
                                    >
                                <StyledTextInput
                                    value={logo} 
                                    placeholder={t('Logo (optional)')}
                                    onUserInput={(value) => {
                                        setLogo(value)
                                        setFormError({...formError, logo: null})
                                    }} />
                                </StyledWrapperWithTooltip>
                            </InputWrap>

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

                            <Heading color="primary" mt="24px">
                                {t('Calculator:')}
                            </Heading>
                            <Flex mt="8px">
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('Estimated Funds Raised')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    {hardCap} {useUSDC ? usdcToken.symbol : 'CRO'}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('Total Tokens Used')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    {depositAmountNumber && searchToken? getFullDisplayBalance(depositAmountNumber, searchToken.decimals) : ''} {searchToken ? searchToken.symbol : ''}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('Tokens For Pre Sale')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    {presaleAmountNumber && searchToken? getFullDisplayBalance(presaleAmountNumber, searchToken.decimals) : ''} {searchToken ? searchToken.symbol : ''}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('Pre Sale Rate Per Token')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    1 {useUSDC ? usdcToken.symbol : 'CRO'} = {rate} {searchToken ? searchToken.symbol : ''}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('Listing Price Per Token')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    1 {useUSDC ? usdcToken.symbol : 'CRO'} = {listingRate} {searchToken ? searchToken.symbol : ''}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="14px" color="secondary" mr="16px">
                                    {t('% of Funds Raised To LP')}:
                                </Text>
                                <Text fontSize="14px" color="primary">
                                    {liquidityPercent} %
                                </Text>
                            </Flex>
                            
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateSale