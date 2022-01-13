import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Text } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'

export interface CardHeadingProps {
  name: string,
  symbol: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<CardHeadingProps> = ({ name, symbol }) => {
  const crowToken = tokens.crow
  return (
    <Wrapper justifyContent="center" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="center">
        <Heading mb="4px" color="primary">{symbol}</Heading>
        <Text mb="4px" color="primary">{name}</Text>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
