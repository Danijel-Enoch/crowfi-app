import React, { useEffect, useState } from 'react'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import useRefresh from 'hooks/useRefresh'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useFetchUserNfts } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsCreated: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const { address: userAddress } = useParams<{ address?: string }>()
    const { t } = useTranslation()
    const [loaded, setLoaded] = useState(false)
    const {onFetchNftsCreated} = useFetchUserNfts(userAddress)

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsCreated()
                setAssets(asses_)
            } catch (e) {
                setAssets([])
            } finally {
                setLoaded(true)
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsCreated])
    

    return (
        <Flex flexDirection="column">
            <Assets items={assets}/>
            { loaded && assets.length === 0 && (
                <Flex height="200px" justifyContent="center" alignItems="center">
                    <Text>{t('No assets found')}</Text>
                </Flex>
            )}
            { !loaded && (
               <Skeleton width="100%" height="200px" animation="waves"/>
            )}
        </Flex>
    )
}

export default AssetsCreated