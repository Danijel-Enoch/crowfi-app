import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Heading, Button, useModal, Skeleton } from '@pancakeswap/uikit'
import { ETHER } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { TokenType } from 'state/types'
import { useTokenFactoryDeployeFee, useLiquidityTokenFactoryDeployeFee } from 'state/tokenFactory/hooks'
import { fetchTokenFactoryPublicDataAsync, fetchTokenFactoryUserDataAsync } from 'state/tokenFactory'
import Select from 'components/Select/Select'
import Dots from 'components/Loader/Dots'
import { StyledNumericalInput, StyledTextInput, StyledIntegerInput, StyledAddressInput} from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import useToast from 'hooks/useToast'
import useENS from 'hooks/ENS/useENS'
import { escapeRegExp } from 'utils'
import { BIG_TEN } from 'utils/bigNumber'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useCreateLiquidityToken, useCreateStandardToken } from '../../hooks/useCreateToken'
import SuccessModal from './SuccessModal'


const InputWrap = styled.div`
    padding: 8px 0px;
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

const CreateTokenSection: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const { toastError, toastSuccess } = useToast()
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    const [tokenType, seteTokenType] = useState(TokenType.STANDARD)
    const [pendingTx, setPendingTx] = useState(false)
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [tokenDecimals, setTokenDecimals] = useState('')
    const [tokenTotalSupply, setTokenTotalSupply] = useState('')
    const [txFee, setTxFee] = useState('')
    const [lpFee, setLpFee] = useState('')
    const [dexFee, setDexFee] = useState('')
    const [devAddress, setDevAddress] = useState('')
    const [tokenAddress, setTokenAddress] = useState('')
    const { address:validatedDevAddress, loading: loadingDevAddress } = useENS(devAddress)
    const { onCreateToken: onCreateStandardToken } = useCreateStandardToken()
    const { onCreateToken: onCreateLiquiditytoken } = useCreateLiquidityToken()
    const deployFee = useTokenFactoryDeployeFee()
    const liquidityDeployFee = useLiquidityTokenFactoryDeployeFee()

    const tokenTypes = [
        { label: t('Standard Token'), value: TokenType.STANDARD },
        { label: t('Liquidity Generator Token'), value: TokenType.LIQUIDITY },
    ]

    const handleTokenTypeChange = (option) =>  {
        seteTokenType(option.value)
    }

    const renderDeployFee = () => {
        if (tokenType === TokenType.STANDARD) {
            if (deployFee) {
                return (
                    <Text fontSize='12px' color="secondary">
                        ${getFullDisplayBalance(deployFee, ETHER.decimals)} ${ETHER.symbol}
                    </Text>
                )
            } 

            return <Skeleton width="100px" height="30px" />
        }

        if (liquidityDeployFee) {
            return (
                <Text fontSize='12px' color="secondary">
                    ${getFullDisplayBalance(liquidityDeployFee, ETHER.decimals)} ${ETHER.symbol}
                </Text>
            )
        } 

        return <Skeleton width="100px" height="30px" />
    }

    const clearForm = () => {
        setTokenName('')
        setTokenSymbol('')
        setTokenDecimals('')
        setTokenTotalSupply('')
        setTokenAddress('')
        setTxFee('')
        setLpFee('')
        setDexFee('')
        setDevAddress('')
    }
    
    const [onPresentSuccess] = useModal(
        <SuccessModal tokenAddress={tokenAddress} customOnDismiss={clearForm}/>,
        false,
        true,
        "CreateTokenSuccessModal"
      )

    const noWhitespaceRegex = RegExp(`^[\\d\\w].*[\\d\\w]$`)

    const isInputInvalid: boolean = useMemo(() => {

        const tokenTotalSupplyNumber = new BigNumber(tokenTotalSupply)
        const tokenDecimalsNumber = new BigNumber(tokenDecimals)
        const txFeeNumber = new BigNumber(txFee)
        const dexFeeNumber = new BigNumber(dexFee)
        const lpFeeNumber = new BigNumber(lpFee)
        return !tokenDecimalsNumber.isFinite() 
        || tokenDecimalsNumber.gt(24)
        || !tokenTotalSupplyNumber.isFinite()
        || tokenTotalSupplyNumber.eq(0)
        || !tokenSymbol
        || tokenSymbol.length < 3
        || !tokenName
        || tokenName.length < 3
        || !noWhitespaceRegex.test(escapeRegExp(tokenName))
        || (tokenType === TokenType.LIQUIDITY && (
            !txFeeNumber.isFinite() || txFeeNumber.gt(10) ||
            !dexFeeNumber.isFinite() || dexFeeNumber.gt(10) ||
            !lpFeeNumber.isFinite() || lpFeeNumber.gt(10) ||
            !validatedDevAddress
        ))

    }, [tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply, noWhitespaceRegex, tokenType, txFee, dexFee, lpFee, validatedDevAddress])

    const handleCreate = useCallback(async () => {
        try {
          setPendingTx(true)
          if (tokenType === TokenType.STANDARD) {
              const res = await onCreateStandardToken(deployFee.toString(), tokenName, tokenSymbol, new BigNumber(tokenTotalSupply).multipliedBy(BIG_TEN.pow(tokenDecimals)).toString(), tokenDecimals)
              setTokenAddress(res)
              dispatch(fetchTokenFactoryPublicDataAsync)
              if (account) {
                dispatch(fetchTokenFactoryUserDataAsync({account}))
              }
              onPresentSuccess()
          } else if (tokenType === TokenType.LIQUIDITY) {
            const res = await onCreateLiquiditytoken(liquidityDeployFee.toString(), tokenName, tokenSymbol, new BigNumber(tokenTotalSupply).multipliedBy(BIG_TEN.pow(tokenDecimals)).toString(), tokenDecimals, txFee, lpFee, dexFee, validatedDevAddress)
            setTokenAddress(res)
            onPresentSuccess()
          }
        } catch (e) {
          toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          console.error(e)
        } finally {
          setPendingTx(false)
        }
      }, [onCreateStandardToken, onCreateLiquiditytoken, deployFee, liquidityDeployFee, tokenName, tokenSymbol, tokenTotalSupply, tokenDecimals, t, toastError, tokenType, txFee, lpFee, dexFee, validatedDevAddress, onPresentSuccess, dispatch, account])

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <Box minWidth="min(320px, 100%)">
                        <Select
                            textColor={theme.colors.primary}
                            width="auto"
                            options={tokenTypes}
                            onOptionChange={handleTokenTypeChange}
                            defaultOptionIndex={0}
                            />
                    </Box>
                </Flex>
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledTextInput value={tokenName} onUserInput={(val) => setTokenName(val)} placeholder={t('Token Name (minimum length : 3)')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledTextInput value={tokenSymbol} onUserInput={(val) => setTokenSymbol(val)} transform={(val) => val.toUpperCase() }placeholder={t('Token Symbol (minimum length : 3)')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput value={tokenDecimals} onUserInput={(val) => setTokenDecimals(val)} placeholder={t('Token Decimal (max 24)')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput value={tokenTotalSupply} onUserInput={(val) => setTokenTotalSupply(val)}  placeholder={t('Token Total Supply')} />
                            </InputWrap>
                            { tokenType === TokenType.LIQUIDITY && (
                                <>
                                <InputWrap>
                                    <StyledIntegerInput value={txFee}
                                    onUserInput={(val) => setTxFee(val)}  placeholder={t('Transaction Fee in % to generate yield')} />
                                </InputWrap>
                                <InputWrap>
                                    <StyledIntegerInput value={lpFee}
                                    onUserInput={(val) => setLpFee(val)}  placeholder={t('Transaction Fee in % to generate Liquidity')} />
                                </InputWrap>
                                <InputWrap>
                                    <StyledIntegerInput value={dexFee}
                                    onUserInput={(val) => setDexFee(val)}  placeholder={t('Transaction Fee in % to dev wallet')} />
                                </InputWrap>
                                <InputWrap>
                                    <StyledAddressInput value={devAddress}
                                    onUserInput={(val) => setDevAddress(val)}  placeholder={t('Dev wallet address')} />
                                </InputWrap>
                                </>
                            )}

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary" disabled={!account || pendingTx || isInputInvalid} onClick={handleCreate}>
                                    {pendingTx ? (
                                        <Dots>{t('Processing')}</Dots>
                                    ): t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            {
                                tokenType === TokenType.STANDARD ? (
                                    <>
                                    <Heading color="primary" mt="8px">
                                        {t('Standard Token Features:')}
                                    </Heading>
                                    <StyledList>
                                        <li>{t('Basic token with all standard features')}</li>
                                        <li>{t('Perfect for utility based projects such as charting tools')}</li>
                                    </StyledList>
                                    </>
                                ) : (
                                    <>
                                    <Heading color="primary" mt="8px">
                                        {t('Liquidity Generator Token Features:')}
                                    </Heading>

                                    <StyledList>
                                        <li>{t('Auto yield and liquidity generation (Safemoon Fork)')}</li>
                                        <li>{t('Customize fees taken to reward holders')}</li>
                                        <li>{t('Customize fees to generate liquidty')}</li>
                                        <li>{t('Customize fees to dev wallet')}</li>
                                        <li>{t('Customize dev wallet address')}</li>
                                        <li>{t('Whitelist functions')}</li>
                                    </StyledList>
                                    </>
                                )
                            }

                            <Flex mt="24px" alignItems="center">
                                <Text fontSize='12px' color="secondary" mr="12px">{t('Deploy fee')}</Text>
                                {renderDeployFee()}
                            </Flex>
                        </Flex>
                        
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateTokenSection