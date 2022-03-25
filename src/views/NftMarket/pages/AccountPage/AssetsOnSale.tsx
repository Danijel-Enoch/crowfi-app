import React, { useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import useRefresh from 'hooks/useRefresh'
import { useParams } from 'react-router-dom'
import { useFetchUserNfts } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsOnSale: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const { address: userAddress } = useParams<{ address?: string }>()
    const {onFetchNftsOnSale} = useFetchUserNfts(userAddress)

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsOnSale()
                setAssets(asses_)
            } catch (e) {
                setAssets([])
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsOnSale])
    

    return (
        <Flex flexDirection="column">
            <Assets items={assets}/>
        </Flex>
    )
}

export default AssetsOnSale