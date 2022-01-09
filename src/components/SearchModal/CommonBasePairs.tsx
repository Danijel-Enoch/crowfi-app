import React from 'react'
import { ChainId, Currency, ETHER, Token } from '@pancakeswap/sdk'
import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage } from 'components/TokenImage'

import { SUGGESTED_PIARS } from '../../config/constants'
import { AutoColumn } from '../Layout/Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Layout/Row'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)};
  border-radius: 10px;
  display: flex;
  padding: 2px 0px 2px 2px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.background};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBasePairs({
  chainId,
  onSelect,
}: {
  chainId?: ChainId
  onSelect: (currencyA: Currency, currencyB: Currency) => void
}) {
  const { t } = useTranslation()
  const etherOrToken = (token: Token) => {
    if (token.symbol.toLowerCase() === 'wcro') {
      return ETHER
    }
    return token
  }
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">{t('Common pairs')}</Text>
        <QuestionHelper text={t('These pairs are commonly used.')} ml="4px" />
      </AutoRow>
      <AutoRow gap="auto">
        {(chainId ? SUGGESTED_PIARS[chainId] : []).map(([tokenA, tokenB]) => {
          return (
            <BaseWrapper onClick={() => onSelect(etherOrToken(tokenA), etherOrToken(tokenB))} key={tokenA.symbol + tokenB.symbol}>
              <TokenPairImage variant='inverted' primaryToken={tokenA} secondaryToken={tokenB} width={32} height={32} style={{ marginRight: 8 }} />
              <Text>{etherOrToken(tokenA).symbol} - {etherOrToken(tokenB).symbol}</Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}
