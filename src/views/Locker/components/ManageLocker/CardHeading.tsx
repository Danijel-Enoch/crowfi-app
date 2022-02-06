import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Text, Skeleton } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'
import { Token } from '@pancakeswap/sdk'
import { PairToken } from 'hooks/Tokens'

export interface CardHeadingProps {
  token?: Token
  token0?: Token
  token1?: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<CardHeadingProps> = ({ token, token0, token1 }) => {
  return (
    <Wrapper justifyContent="center" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="center">
        { token0 && token1 ? (
          <>
          <Heading mb="4px" color="primary">{token.symbol}</Heading>
          <Text mb="4px" color="primary">{token0.symbol} / {token1.symbol}</Text>
          </>
        ) 
        : token ?
        (
          <>
          <Heading mb="4px" color="primary">{token.symbol}</Heading>
          <Text mb="4px" color="primary">{token.name}</Text>
          </>
        ) : (
          <>
          <Skeleton mb="4px" width="100px" height="30px"/>
          <Skeleton mb="4px" width="100px" height="20px"/>
          </>
        )}
        
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
