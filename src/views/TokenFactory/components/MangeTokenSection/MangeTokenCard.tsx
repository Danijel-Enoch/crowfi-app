import React, { useMemo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, Flex, Text, Button, Skeleton, useModal, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalanceExact } from 'utils/formatBalance'
import { StyledAddressInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import TokenAddress from 'components/TokenAddress'
import Dots from 'components/Loader/Dots'
import Loading from 'components/Loading'
import useToast from 'hooks/useToast'
import useENS from 'hooks/ENS/useENS'
import { useAppDispatch } from 'state'
import { DeserializedTokenData, TokenType } from 'state/types'
import { fetchTokenFactoryUserDataAsync } from 'state/tokenFactory'
import { BIG_TEN } from 'utils/bigNumber'
import CardHeading from './CardHeading'
import ConfirmBurnModal from './ConfirmBurnModal'
import ConfirmWhitelistModal from './ConfirmWhitelistModal'
import { useLPGeneratorTokenFee } from '../../hooks/useLPGeneratorToken'

const StyledCard = styled(Card)`
  align-self: baseline;
  filter: ${({ theme }) => theme.card.dropShadow};
`

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`
const InputWrap = styled.div`
    position: relative;
    padding: 8px 0px;
`

const InputLoadingWrapper = styled(Loading)`
    position: absolute;
    right: 12px;
    top: calc(50% - 12px);
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledButton = styled(Button)`
  flex-grow: 1;
`

export interface ManageTokenCardProps {
  tokenData?: DeserializedTokenData
  account?: string
}

const ManageTokenCard: React.FC<ManageTokenCardProps> = ({account, tokenData}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError, toastSuccess } = useToast()
  const [burnAmount, setBurnAmount] = useState('')
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const { address:validatedWhitelistAddress, loading: loadingWhitelistAddress } = useENS(whitelistAddress)
  const [pendingTaxFee, setPendingTaxFee] = useState(false)
  const [pendingLpFee, setPendingLpFee] = useState(false)
  const [taxFee, setTaxFee] = useState('')
  const taxFeeNumber = useMemo(() => {
    return new BigNumber(taxFee)
  }, [taxFee])
  const [lpFee, setLpFee] = useState('')
  const lpFeeNumber = useMemo(() => {
    return new BigNumber(lpFee)
  }, [lpFee])
  const [taxInitialized, setTaxInitialized] = useState(false)
  const [lpInitialized, setLpInitialized] = useState(false)
  const { onSetLpFee, onSetTaxFee } = useLPGeneratorTokenFee(tokenData.address)
  const burnAmountNumber = new BigNumber(burnAmount).multipliedBy(BIG_TEN.pow(tokenData.decimals))

  const handleChangePercent = (percent: number) => {
    if (percent === 100) {
      setBurnAmount(getFullDisplayBalanceExact(tokenData.totalSupply, tokenData.decimals))
    } else {
      const amount = tokenData.totalSupply.multipliedBy(percent).div(100)
      setBurnAmount(getFullDisplayBalanceExact(amount, tokenData.decimals))
    }
  }

  const handleBurnComplete = () => {
    console.log('completed')
  }

  const [onPresentConfirmBurnModal] = useModal(
    <ConfirmBurnModal
      token={tokenData}
      amount={burnAmountNumber}
      onComplete={handleBurnComplete}
    />,
    false,
    false,
    'confirmTokenBurnModal'
  )

  const [onPresentAddToWhitelistModal] = useModal(
    <ConfirmWhitelistModal
      token={tokenData}
      address={validatedWhitelistAddress}
      isAdd
    />,
    false,
    false,
    'ConfirmAddToWhitelistModal'
  )

  const [onPresentRemoveFromWhitelistModal] = useModal(
    <ConfirmWhitelistModal
      token={tokenData}
      address={validatedWhitelistAddress}
      isAdd={false}
    />,
    false,
    false,
    'ConfirmRemoveFromWhitelistModal'
  )

  const showConfirmBurn = useCallback(async() => {
    onPresentConfirmBurnModal()
  }, [onPresentConfirmBurnModal])

  const showAddToWhitelist = useCallback(async() => {
    onPresentAddToWhitelistModal()
  }, [onPresentAddToWhitelistModal])

  const showRemoveFromWhitelist = useCallback(async() => {
    onPresentRemoveFromWhitelistModal()
  }, [onPresentRemoveFromWhitelistModal])

  useEffect(() => {
    if (!taxInitialized && tokenData.taxFee) {
      setTaxInitialized(true)
      setTaxFee((tokenData.taxFee.toNumber() / 100).toString())
    }
    if (!lpInitialized && tokenData.lpFee) {
      setLpInitialized(true)
      setLpFee((tokenData.lpFee.toNumber() / 100).toString())
    }
  }, [tokenData.taxFee, tokenData.lpFee, taxInitialized, lpInitialized])

  const handleChangeTaxFee = useCallback(async () => {
    try {
      setPendingTaxFee(true)
      const newFee = taxFeeNumber.multipliedBy(100).toString()
      await onSetTaxFee(newFee)
      dispatch(fetchTokenFactoryUserDataAsync({account}))
      toastSuccess(t('Success'), t('Holder reward fee has been changed to %amount%%', {amount: new BigNumber(newFee).div(100).toJSON()}))
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingTaxFee(false)
    }
  }, [t, toastError, toastSuccess, onSetTaxFee, dispatch, account, taxFeeNumber])

  const handleChangeLpFee = useCallback(async () => {
    try {
      setPendingLpFee(true)
      const newFee = lpFeeNumber.multipliedBy(100).toString()
      await onSetLpFee(newFee)
      dispatch(fetchTokenFactoryUserDataAsync({account}))
      toastSuccess(t('Success'), t('Liquidity fee has been changed to %amount%%', {amount: new BigNumber(newFee).div(100).toJSON()}))
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingLpFee(false)
    }
  }, [t, toastError, toastSuccess, onSetLpFee, dispatch, account, lpFeeNumber])

  const {
    tooltipVisible: taxFeeTooltipVisible,
    targetRef: taxFeeTargetRef,
    tooltip: taxFeeTooltip,
  } = useTooltip((
    <>
    <Flex>
      <Button
        variant='secondary'
        scale="sm"
        mr="8px"
        disabled={pendingTaxFee} 
        onClick={() => {
          setTaxFee((tokenData.taxFee.toNumber() / 100).toString())
        }}>
        {t('Cancel')}
      </Button>
      <Button 
        scale="sm"
        variant='primary'
        disabled={pendingTaxFee || !taxFeeNumber || !taxFeeNumber.isFinite() || taxFeeNumber.gt(BIG_TEN)} 
        onClick={handleChangeTaxFee}>
        { pendingTaxFee ? (<Dots>{t('Chaning')}</Dots>) : t('Change')}
      </Button>
    </Flex>
    </>
  ), { placement: "bottom", trigger: "click" });

  const {
    tooltipVisible: lpFeeTooltipVisible,
    targetRef: lpFeeTargetRef,
    tooltip: lpFeeTooltip,
  } = useTooltip((
    <>
    <Flex>
      <Button
        variant='secondary'
        scale="sm"
        mr="8px"
        disabled={pendingLpFee} 
        onClick={() => {
          setLpFee((tokenData.lpFee.toNumber() / 100).toString())
        }}>
        {t('Cancel')}
      </Button>
      <Button 
        scale="sm"
        variant='primary'
        disabled={pendingLpFee || !lpFeeNumber || !lpFeeNumber.isFinite() || lpFeeNumber.gt(BIG_TEN)} 
        onClick={handleChangeLpFee}>
        { pendingLpFee ? (<Dots>{t('Chaning')}</Dots>) : t('Change')}
      </Button>
    </Flex>
    </>
  ), { placement: "bottom", trigger: "click" });

  const renderBurnSection = () : JSX.Element => {
    return (
    <Flex flexDirection="column" style={{borderTop: "1px solid rgba(0,0,0,0.4)", paddingTop:"16px", marginTop:"8px"}}>
      <StyledNumericalInput 
        value={burnAmount}
        onUserInput={(val) => setBurnAmount(val)}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <StyledButton scale="xs" mx="2px" p="4px 8px" variant="tertiary" onClick={() => handleChangePercent(25)}>
          25%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 8px" variant="tertiary" onClick={() => handleChangePercent(50)}>
          50%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 8px" variant="tertiary" onClick={() => handleChangePercent(75)}>
          75%
        </StyledButton>
        <StyledButton scale="xs" mx="2px" p="4px 8px" variant="tertiary" onClick={() => handleChangePercent(100)}>
          {t('Max')}
        </StyledButton>
      </Flex>
      <Button mt="8px" width="100%" disabled={!burnAmountNumber || !burnAmountNumber.isFinite() || burnAmountNumber.eq(0) || !tokenData.totalSupply.isFinite() || tokenData.totalSupply.eq(0) || burnAmountNumber.gt(tokenData.totalSupply)} onClick={showConfirmBurn}>
        {t('Burn')}
      </Button>
    </Flex>
    )
  }

  const renderWhitelistSection = () : JSX.Element => {
    return (
    <Flex flexDirection="column" style={{borderTop: "1px solid rgba(0,0,0,0.4)", paddingTop:"12px", marginTop:"8px"}}>
      <InputWrap>
        <Text fontSize="12px" color="secondary" mb="8px">
        {t('Enter an address below to add or remove it from whitelist!A whitelisted address will not be charged fees!')}
        </Text>
        <StyledAddressInput 
          value={whitelistAddress}
          onUserInput={(val) => setWhitelistAddress(val)}  
          placeholder={t('Ex. 0xA2c8e14B7Cc468131C2c1d409b58Be9E344701e4')} />
        <InputLoadingWrapper style={{display: loadingWhitelistAddress ? 'flex' : 'none'}}>
          <Loading/>
        </InputLoadingWrapper>
      </InputWrap>
      <Flex>
        <Flex mr="8px" flex="1">
          <Button mt="8px" width="100%" variant="secondary" disabled={!validatedWhitelistAddress} onClick={showRemoveFromWhitelist}>
            {t('Remove')}
          </Button>
        </Flex>
        <Flex flex="1">
        <Button mt="8px" width="100%" disabled={!validatedWhitelistAddress} onClick={showAddToWhitelist}>
          {t('Add')}
        </Button>
        </Flex>
      </Flex>
      
    </Flex>
    )
  }

  return (
    <StyledCard>
        <CardInnerContainer>
            <CardHeading symbol={tokenData.symbol} name={tokenData.name}/>
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Type')}:</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {tokenData.type === TokenType.STANDARD ? 'Standard' : 'Liquidity Generator'}
                </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Decimals')}:</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  { tokenData.decimals }
                </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Supply')}:</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                  {getFullDisplayBalanceExact(tokenData.totalSupply, tokenData.decimals)}
                </Text>
            </Flex>
            {
              tokenData.type === TokenType.LIQUIDITY && (
                <>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text style={{flex: 1}}>{t('Holder Reward Fee')}:</Text>
                  { tokenData.taxFee ? (
                    <>
                    <Flex>
                      <StyledNumericalInput
                        innerRef={taxFeeTargetRef}
                        style={{maxWidth:"60px", textAlign:"right", height:"20px"}}
                        placeholder={t('Max %amount%%', {amount: 10})}
                        value={taxFee}
                        disabled={pendingTaxFee}
                        onUserInput={(val) => setTaxFee(val)}
                      />
                      <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                        %
                      </Text>
                    </Flex>
                    { taxFeeTooltipVisible && taxFeeTooltip}
                    </>
                  ) : (
                    <Skeleton height="22px" width="60px" />
                  )}
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>{t('Liquidity Fee')}:</Text>
                  { tokenData.lpFee ? (
                    <>
                    <Flex>
                      <StyledNumericalInput
                        innerRef={lpFeeTargetRef}
                        style={{maxWidth:"60px", textAlign:"right", height:"20px"}}
                        placeholder={t('Max %amount%%', {amount: 10})}
                        value={lpFee}
                        disabled={pendingLpFee}
                        onUserInput={(val) => setLpFee(val)}
                      />
                      <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                        %
                      </Text>
                    </Flex>
                    { lpFeeTooltipVisible && lpFeeTooltip}
                    </>
                  ) : (
                    <Skeleton height="22px" width="60px" />
                  )}
                </Flex>
                </>
              )
            }
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Address')}:</Text>
                <TokenAddress address={tokenData.address} />
            </Flex>
            { 
              tokenData.type === TokenType.STANDARD && (
                <>
                {renderBurnSection()}
                </>
              )
            }
            {
              tokenData.type === TokenType.LIQUIDITY && (
                <>
                {renderWhitelistSection()}
                </>
              )
            }
        </CardInnerContainer>
    </StyledCard>
  )
}

export default ManageTokenCard
