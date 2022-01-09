import React from 'react'
import { ChainId, Currency, ETHER, Token } from '@pancakeswap/sdk'
import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage } from 'components/TokenImage'

import { SUGGESTED_BASES } from '../../config/constants'
import { AutoColumn } from '../Layout/Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Layout/Row'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

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
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">{t('Common pairs')}</Text>
        <QuestionHelper text={t('These pairs are commonly used.')} ml="4px" />
      </AutoRow>
      <AutoRow gap="auto">
        <BaseWrapper
          onClick={() => {
            onSelect(ETHER, tokens.crow)
          }}
        >
          <TokenPairImage variant='inverted' primaryToken={tokens.wcro} secondaryToken={tokens.crow} width={32} height={32} style={{ marginRight: 8 }} />
          <Text>{ETHER.symbol} - CROW</Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).filter((token) => token.symbol.toLowerCase() !== 'crow' && token.symbol !== 'WCRO').map((token: Token) => {
          return (
            <BaseWrapper onClick={() => onSelect(token, tokens.crow)} key={token.address}>
              <TokenPairImage variant='inverted' primaryToken={token} secondaryToken={tokens.crow} width={32} height={32} style={{ marginRight: 8 }} />
              <Text>{token.symbol} - CROW</Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}
