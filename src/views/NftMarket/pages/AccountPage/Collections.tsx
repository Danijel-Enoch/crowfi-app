import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled, {css} from 'styled-components'
import { useProfileLoggedIn } from 'state/profile/hooks'
import { ProfileLoginStatus } from 'state/types'
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
    const [loaded, setLoaded] = useState(false)
    const {loginStatus, profileAddress} = useProfileLoggedIn()
    const [itemSize, setItemSize] = useState(ItemSize.LARGE)
    const [collections, setCollections] = useState([])
    const { slowRefresh } = useRefresh()

    const isMe = useMemo(() => {

        return loginStatus === ProfileLoginStatus.LOGGEDIN && account?.toLowerCase() === profileAddress.toLowerCase()

    }, [account, profileAddress, loginStatus])

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const collections_ = await getCollectionsWithQueryParams({creator: account.toLowerCase()})
                setCollections(collections_)
            } catch (e) {
                setCollections([])
            } finally {
                setLoaded(true)
            }
        }
            
        fetchCollections()
        
    }, [account, slowRefresh])

    return (
        <Flex flexDirection="column">
            <CollectionsNav itemSize={itemSize} onItemSizeChange={(size) => setItemSize(size)} showCreate={isMe}/>
            <Flex flexDirection="column">
                <ItemsContainer flexWrap="wrap">
                    {collections.map((item) => {
                        return (
                        <Flex padding="8px" flexDirection="column" key={item.id}>
                            <CollectionCard collection={item}/>
                        </Flex>
                        )
                    })}
                </ItemsContainer>
                { loaded && collections.length === 0 && (
                    <Flex height="200px" justifyContent="center" alignItems="center">
                        <Text>{t('No assets found')}</Text>
                    </Flex>
                )}
                { !loaded && (
                    <Skeleton width="100%" height="200px" animation="waves"/>
                )}
                
            </Flex>
        </Flex>
    )
}

export default Collections