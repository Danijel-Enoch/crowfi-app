import { Flex, Text } from '@pancakeswap/uikit'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { NFTAttribute } from '../hooks/types'

const Wrapper = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: ${({ theme }) => theme.radii.default};
`

const Inner = styled(Flex).attrs({flexDirection: "column"})`
    align-items: center;
    width: 128px;
    margin: 10px;
`

const TypeText = styled(Text).attrs({ellipsis: true})`
    max-width: 100%;
    font-size: 10px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.secondary};
`

const ValueText = styled(Text).attrs({ellipsis: true})`
    margin-top: 4px;
    max-width: 100%;
    font-size: 14px;
`

interface TextTraitProps {
    trait: NFTAttribute
}

const TextTrait: React.FC<TextTraitProps> = ({trait}) => {
    return (
        <Wrapper>
            <Inner>
                <TypeText>
                    {trait.trait_type}
                </TypeText>
                <ValueText>
                    {trait.value}
                </ValueText>
            </Inner>
        </Wrapper>
    )
}

export default TextTrait