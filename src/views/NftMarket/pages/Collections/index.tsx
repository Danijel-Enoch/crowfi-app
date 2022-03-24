import React, { useCallback, useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useRefresh from 'hooks/useRefresh'
import CollectionCard from './CollectionCard'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'

const Wrapper = styled(Flex).attrs({flexDirection:'column'})`
    background-color: white;
`

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

const Collections: React.FC = () => {
    const [collections, setCollections] = useState([])
    const { slowRefresh } = useRefresh()

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const collections_ = await getCollectionsWithQueryParams({})
                setCollections(collections_)
            } catch {
                setCollections([])
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh])
    return (
        <Wrapper>
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
        </Wrapper>
    )
}

export default Collections