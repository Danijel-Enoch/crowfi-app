import React from 'react'
import styled from 'styled-components'
import { Text, Button, InputProps, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { Input as NumericalInput } from './NumericalInput'

interface PSClaimInputProps {
  enabled:boolean
  max?: BigNumber
  symbol: string
  onSelectMax?: () => void
  onChange: (string) => void
  placeholder?: string
  value: string
  inputTitle?: string
  decimals?: number
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const DescText = styled(Text)`
  font-size: 10px;
  @media screen and (max-width: 400px) {
    font-size: 9px;
  }
`

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
  min-width: 300px;
  @media screen and (max-width: 400px) {
    min-width: calc(100vw - 105px);
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const PSClaimInput: React.FC<PSClaimInputProps> = ({
  enabled = true,
  max,
  onChange,
  onSelectMax,
  value,
  inputTitle
}) => {
  const { t } = useTranslation()
  const isBalanceZero = !max || max.eq(0)

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero && enabled}>
        <DescText textAlign="right" pb="8px">
          {t('Enter the amount of tokens you wish to claim')}
        </DescText>
        <Flex alignItems="center" justifyContent="space-around">
          <Button scale="sm" onClick={onSelectMax} ml="8px">
            {t('Max')}
          </Button>
          <NumericalInput
            disabled={!enabled}
            className="token-amount-input"
            value={value}
            onUserInput={onChange}
            align="right"
            placeholder="0"
          />
        </Flex>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{t('Balance: %balance%', { balance: getBalanceNumber(max) })}</Text>
          <Text fontSize="14px">{inputTitle}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && enabled && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t('No tokens to claim')}
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default PSClaimInput
