import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled, {css} from 'styled-components'
import AssetCard from '../Assets/AssetCard'
import {ItemSize} from '../Assets/types'
import AssetsNav from './AssetsNav'

const ItemsContainer = styled(Flex).attrs({flexWrap: "wrap"})<{itemSize: ItemSize}>`
    
    > div {
        width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '100%' : '50%'};
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        > div {
            width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '50%' : '33.33%'};
        }
    }

    ${({ theme }) => theme.mediaQueries.md} {
        > div {
            width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '33.33%' : '20%'};
        }
    }
    ${({ theme }) => theme.mediaQueries.xl} {
        > div {
            width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '25%' : '16.6%' };
        }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
        > div {
            width: ${({ itemSize }) => itemSize === ItemSize.LARGE ? '20%' : '14.28%' };
        }
    }
`


const Assets: React.FC = () => {

    const { t } = useTranslation()
    const [itemSize, setItemSize] = useState(ItemSize.LARGE)

    const items = [1, 1, 1, 1, 1, 1, 1, 1, 1,1, 1,1 ,1 ,1,1]

    return (
        <Flex flexDirection="column">
            <AssetsNav itemSize={itemSize} onItemSizeChange={(size) => setItemSize(size)}/>
            <Flex flex="1">
                <ItemsContainer flexWrap="wrap" itemSize={itemSize}>
                    {items.map((item) => {
                        return (
                        <Flex padding="8px" flexDirection="column">
                            <AssetCard/>
                        </Flex>
                        )
                    })}
                </ItemsContainer>
                
            </Flex>
        </Flex>
    )
}

export default Assets