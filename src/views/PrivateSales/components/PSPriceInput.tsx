import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { parseUnits } from 'ethers/lib/utils'
import { getBalanceNumber } from 'utils/formatBalance'
import tokens from 'config/constants/tokens'
import BigNumber from 'bignumber.js'
import { Input as NumericalInput } from './NumericalInput'

interface PSPriceInputProps {
  enabled: boolean
  price: number
  max: string
  symbol: string
  onChange: (string) => void
  value: string
  usdcBalance: BigNumber
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
  padding: 8px 16px 8px 0;
  width: 100%;
  min-width: 300px;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  border: none;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const PSPriceInput: React.FC<PSPriceInputProps> = ({
  enabled,
  max,
  price,
  symbol,
  onChange,
  value,
  usdcBalance
}) => {
  const { t } = useTranslation()
  const tooLow = value ? parseFloat(value) < 1e-3 : false
  const tooMuch = value ? parseFloat(value) > parseFloat(max) : false
  const usdPrice = Number.isNaN(parseFloat(value)) ? 0 : price * parseFloat(value)
  const usdcBalanceNumber = getBalanceNumber(usdcBalance, tokens.usdc.decimals)

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={tooLow || tooMuch}>
        <Text fontSize='10px' textAlign="right" pb="8px">
          {t('Enter the amount of tokens you wish to purchase')}
        </Text>
        <Flex alignItems="flex-end" justifyContent="space-around" pl="16px">
          <NumericalInput
            disabled={!enabled}
            className="token-amount-input"
            value={value}
            onUserInput={onChange}
            align="right"
          />
        </Flex>
        <Flex justifyContent="right" pl="16px" alignItems="end">
          <Text fontSize="14px">${usdPrice}</Text>
          <Text fontSize="12px">&nbsp;{'  USDC'}</Text>
        </Flex>
        {usdcBalance && (
          <Flex justifyContent="right" pl="16px" alignItems="end">
            <Text fontSize="10px">Balance : ${usdcBalanceNumber} USDC</Text>
          </Flex> 
        )}
      </StyledTokenInput>
      {tooLow && enabled && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t('Too small to buy')}
        </StyledErrorMessage>
      )}
      {tooMuch && enabled && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t('At most ')}{max}&nbsp;{symbol}
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default PSPriceInput
