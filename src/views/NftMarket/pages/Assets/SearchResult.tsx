import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled, {css} from 'styled-components'
import AssetCard from './AssetCard'
import {ItemSize} from './types'
import { NFTResponse } from '../../hooks/types'

const Wrapper = styled(Flex).attrs({flexDirection:"column"})`
    min-height: calc(100vh - 200px);
`
const ItemsContainer = styled(Flex).attrs({flexWrap: "wrap"})<{itemSize: ItemSize, isFilterOpen: boolean}>`
    
    > div {
        width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '100%' : '50%'};
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        > div {
            width: ${({ itemSize, isFilterOpen }) => itemSize === ItemSize.LARGE ? (isFilterOpen ? '100%' : '50%') : (isFilterOpen ? '50%' : '33.33%')};
        }
    }

    ${({ theme }) => theme.mediaQueries.md} {
        > div {
            width: ${({ itemSize,isFilterOpen }) => itemSize === ItemSize.LARGE ? (isFilterOpen ? '50%' : '33.33%') : (isFilterOpen ? '25%' : '20%')};
        }
    }
    ${({ theme }) => theme.mediaQueries.xl} {
        > div {
            width: ${({ itemSize,isFilterOpen }) => itemSize === ItemSize.LARGE ? (isFilterOpen ? '33.33%' : '25%') : (isFilterOpen ? '20%' : '16.6%')};
        }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
        > div {
            width: ${({ itemSize,isFilterOpen }) => itemSize === ItemSize.LARGE ? (isFilterOpen ? '25%' : '20%') : (isFilterOpen ? '16.6%' : '14.28%')};
        }
    }
`

interface SearchResultProps {
    isFilterOpen: boolean
    itemSize: ItemSize
    items?: NFTResponse[]
}

const SearchResult: React.FC<SearchResultProps> = ({isFilterOpen, itemSize, items}) => {

    const { t } = useTranslation()

    return (
        <Wrapper>
            <ItemsContainer flexWrap="wrap" itemSize={itemSize} isFilterOpen={isFilterOpen}>
                {items && items.map((item) => {
                    return (
                    <Flex padding="8px" flexDirection="column" key={item.id}>
                        <AssetCard asset={item}/>
                    </Flex>
                    )
                })}
            </ItemsContainer>
            
        </Wrapper>
    )
}

export default SearchResult