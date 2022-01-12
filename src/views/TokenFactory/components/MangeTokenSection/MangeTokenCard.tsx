import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Card, Flex, Text, Button, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { TokenType } from '../../types'
import CardHeading from './CardHeading'
import TokenAddress from './TokenAddress'

const StyledCard = styled(Card)`
  align-self: baseline;
  filter: ${({ theme }) => theme.card.dropShadow};
`

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`
const StyledLinkExternal = styled(LinkExternal)`
  margin-top: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

export interface ManageTokenCardProps {
    address?: string
    name: string
    symbol: string
    decimals: number
    totalSupply?: BigNumber
    type: TokenType
}

const ManageTokenCard: React.FC<ManageTokenCardProps> = ({address, name, symbol, decimals, totalSupply, type}) => {
  const { t } = useTranslation()

  return (
    <StyledCard>
        <CardInnerContainer>
            <CardHeading
                symbol={symbol}
                name={name} 
            />
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Supply')}:</Text>
                <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                    {getFullDisplayBalance(totalSupply, decimals)}
                </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Address')}:</Text>
                <TokenAddress address={address} />
            </Flex>
            <Button mt="8px" width="100%">
              {t('Burn')}
            </Button>
        </CardInnerContainer>
    </StyledCard>
  )
}

export default ManageTokenCard
