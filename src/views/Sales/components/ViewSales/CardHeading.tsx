import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Text } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { PublicSaleData } from '../../types'

export interface CardHeadingProps {
  sale?: PublicSaleData
  token: Token,
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const SymbolText = styled(Text)`
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const Logo = styled.div`
  width: 64px;
  height: 64px;
  position: relative;
  > img {
    width: 100%;
    height: 100%;
    object-fit:contain;
  }
`

const CardHeading: React.FC<CardHeadingProps> = ({ token, sale }) => {

  const { t } = useTranslation()

  const status = useMemo(() => {
    const now = new Date().getTime() / 1000;

    if (sale.canceled) {
      return t('Canceled')
    }
    if (sale.finalized) {
      return t('Finalized')
    }

    if (sale.closingTime < now) {
      return t('Closed')
    }

    if (sale.openingTime < now) {
      return t('In Progress')
    }

    return t('Pending')

  }, [sale, t])

  const statusColor = useMemo(() => {
    if (status === 'Closed') {
      return 'red'
    }
    if (status === 'canceled') {
      return 'gray'
    }

    if (status === 'Running') {
      return 'primary'
    }

    if (status === 'Finalized') {
      return 'green'
    }

    return 'gray'

  }, [status])
  return (
    <Wrapper justifyContent="flex-start" alignItems="center" mb="12px">
      {sale.logo && sale.logo.length > 0 ? (
        <Logo>
          <img src={sale.logo} alt="Logo"/>
        </Logo>
      ) : (
        <Logo>
          <img src="https://crowfi.app/logo.png" alt="Logo"/>
        </Logo>
      )}
      <Flex flexDirection="column" alignItems="start" ml="12px">
        <Heading mb="4px" color="primary">{token ? token.name : ''}</Heading>
        <Flex justifyContent="flex-start" alignItems="center">
          <SymbolText color="primary" mr="8px">{token ? token.symbol : ''}</SymbolText>
          <Text fontSize="10px" color={statusColor}>
            { status}
          </Text>
        </Flex>
        
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
