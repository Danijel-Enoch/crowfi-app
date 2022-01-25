import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Text } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'
import { Token } from '@pancakeswap/sdk'

export interface CardHeadingProps {
  symbol: string
  name: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<CardHeadingProps> = ({ symbol, name }) => {
  const crowToken = tokens.crow
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <TokenImage token={crowToken} width={64} height={64}/>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{symbol}</Heading>
        <Text mb="4px">{name}</Text>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
