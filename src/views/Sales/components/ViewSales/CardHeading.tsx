import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Text } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { TokenImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'

export interface CardHeadingProps {
  logo?: string,
  token: Token,
  startDate: number,
  endDate: number
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

const CardHeading: React.FC<CardHeadingProps> = ({ logo, token, startDate, endDate }) => {
  const status = useMemo(() => {
    if (endDate < new Date().getTime() / 1000) {
      return 'Closed'
    }

    if (startDate < new Date().getTime() / 1000) {
      return 'Running'
    }

    return 'Pending'

  }, [startDate, endDate])

  const statusColor = useMemo(() => {
    if (status === 'Closed') {
      return 'red'
    }

    if (status === 'Running') {
      return 'primary'
    }

    return 'gray'

  }, [status])
  return (
    <Wrapper justifyContent="flex-start" alignItems="center" mb="12px">
      {logo && logo.length > 0 ? (
        <Logo>
          <img src={logo} alt="Logo"/>
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
