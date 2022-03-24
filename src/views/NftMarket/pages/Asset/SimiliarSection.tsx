import React, { useMemo } from 'react'
import { Flex, ListViewIcon } from '@pancakeswap/uikit'
import { NFTAssetType } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTMeta, NFTResponse } from '../../hooks/types'
import ExpandablePanel from '../../components/ExpandablePanel'
import {ItemSize} from '../Assets/types'
import AssetCard from '../Assets/AssetCard'

const Wrapper = styled(Flex).attrs({flexDirection:"column"})`
    min-height: 100px;
`

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

interface SimiliarSectionProps {
    metadata: NFTMeta
    items?: NFTResponse[]
}

const SimiliarSection: React.FC<SimiliarSectionProps> = ({metadata, items}) => {

    const { t } = useTranslation()

    
    return (
        <Flex flexDirection="column" padding="12px">
            <ExpandablePanel
                icon={<ListViewIcon/>}
                title={t('More From This Collection')}
            >
                <Wrapper>
                    <ItemsContainer flexWrap="wrap" itemSize={ItemSize.SMALL}>
                        {items && items.map((item) => {
                            return (
                            <Flex padding="8px" flexDirection="column">
                                <AssetCard asset={item}/>
                            </Flex>
                            )
                        })}
                    </ItemsContainer>
                </Wrapper>
            </ExpandablePanel>
        </Flex>
    )
}

export default SimiliarSection