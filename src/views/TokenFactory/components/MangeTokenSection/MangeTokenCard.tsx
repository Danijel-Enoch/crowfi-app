import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, Flex, Text, Button, LinkExternal, Skeleton, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getFullDisplayBalanceExact } from 'utils/formatBalance'
import { StyledAddressInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import TokenAddress from 'components/TokenAddress'
import Loading from 'components/Loading'
import { AutoRow } from 'components/Layout/Row'
import { useToken } from 'hooks/Tokens'
import useTotalSupply from 'hooks/useTotalSupply'
import useENS from 'hooks/ENS/useENS'
import { DeserializedTokenData, TokenType } from 'state/types'
import { BIG_TEN } from 'utils/bigNumber'
import CardHeading from './CardHeading'
import ConfirmBurnModal from './ConfirmBurnModal'
import ConfirmWhitelistModal from './ConfirmWhitelistModal'

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
}

const ManageTokenCard: React.FC<ManageTokenCardProps> = ({tokenData}) => {
  const { t } = useTranslation()

  const [burnAmount, setBurnAmount] = useState('')
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const { address:validatedWhitelistAddress, loading: loadingWhitelistAddress } = useENS(whitelistAddress)

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
                  <Text>{t('Holder Reward Fee')}:</Text>
                  { tokenData.taxFee ? (
                    <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                      {tokenData.taxFee.toNumber() / 100} %
                    </Text>
                  ) : (
                    <Skeleton height="22px" width="60px" />
                  )}
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>{t('Liquidity Fee')}:</Text>
                  { tokenData.lpFee ? (
                    <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                      {tokenData.lpFee.toNumber() / 100} %
                    </Text>
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
