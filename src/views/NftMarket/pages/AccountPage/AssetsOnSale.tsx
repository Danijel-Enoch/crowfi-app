import React, { useEffect, useState } from 'react'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { useParams } from 'react-router-dom'
import useRefresh from 'hooks/useRefresh'
import { useTranslation } from 'contexts/Localization'
import { useFetchUserNfts } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsOnSale: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const { address: userAddress } = useParams<{ address?: string }>()
    const { t } = useTranslation()
    const [loaded, setLoaded] = useState(false)
    const {onFetchNftsOnSale} = useFetchUserNfts(userAddress)

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsOnSale()
                setAssets(asses_)
            } catch (e) {
                setAssets([])
            } finally {
                setLoaded(true)
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsOnSale])
    

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

export default AssetsOnSale