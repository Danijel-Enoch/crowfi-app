import React from 'react'
import styled from 'styled-components'
import { Text, InputProps, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import tokens from 'config/constants/tokens'
import BigNumber from 'bignumber.js'
import { Input as NumericalInput } from './NumericalInput'

interface CurrencyInputProps {
  enabled: boolean
  symbol: string
  onChange: (string) => void
  value: string
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 8px;
  width: 100%;
  min-width: 300px;
  @media screen and (max-width: 400px) {
    min-width: calc(100vw - 105px);
  }
`

const DescText = styled(Text)`
  font-size: 10px;
  @media screen and (max-width: 400px) {
    font-size: 9px;
  }
`

const StyledErrorMessage = styled(Text)`
  a {
    display: inline;
  }
`

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  enabled,
  symbol,
  onChange,
  value
}) => {
  const { t } = useTranslation()

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput>
        {/* <DescText textAlign="left" pb="8px" pl="8px">
          {t('Enter the amount of tokens you wish to purchase')}
        </DescText> */}
        <Flex alignItems="center" pl="8px">
          <NumericalInput
            disabled={!enabled}
            className="token-amount-input"
            value={value}
            onUserInput={onChange}
            align="left"
          />
          <DescText textAlign="left" pl="8px">
            {symbol}
          </DescText>
        </Flex>
      </StyledTokenInput>
    </div>
  )
}

export default CurrencyInput
