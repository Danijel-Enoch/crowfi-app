import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled, {css} from 'styled-components'
import useRefresh from 'hooks/useRefresh'
import AssetCard from '../Assets/AssetCard'
import {ItemSize} from '../Assets/types'
import CollectionsNav from './CollectionsNav'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'
import CollectionCard from '../Collections/CollectionCard'

const ItemsContainer = styled(Flex).attrs({flexWrap: "wrap"})`
    
    > div {
        width: 100%;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        > div {
            width: 50%;
        }
    }
    ${({ theme }) => theme.mediaQueries.xl} {
        > div {
            width: 33%;
        }
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
        > div {
            width: 25%;
        }
    }
`

interface CollectionsProps {
    account: string
}

const Collections: React.FC<CollectionsProps> = ({account}) => {

    const { t } = useTranslation()
    const [itemSize, setItemSize] = useState(ItemSize.LARGE)
    const [collections, setCollections] = useState([])
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const collections_ = await getCollectionsWithQueryParams({creator: account.toLowerCase()})
                setCollections(collections_)
            } catch (e) {
                setCollections([])
            }
        }
            
        fetchCollections()
        
    }, [account, slowRefresh])

    return (
        <Flex flexDirection="column">
            <CollectionsNav itemSize={itemSize} onItemSizeChange={(size) => setItemSize(size)}/>
            <Flex flexDirection="column">
                <ItemsContainer flexWrap="wrap">
                    {collections.map((item) => {
                        return (
                        <Flex padding="8px" flexDirection="column">
                            <CollectionCard collection={item}/>
                        </Flex>
                        )
                    })}
                </ItemsContainer>
                
            </Flex>
        </Flex>
    )
}

export default Collections