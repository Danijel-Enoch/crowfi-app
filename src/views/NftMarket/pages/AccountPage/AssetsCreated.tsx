import React, { useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import useRefresh from 'hooks/useRefresh'
import { useParams } from 'react-router-dom'
import { useFetchUserNfts } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsCreated: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const { address: userAddress } = useParams<{ address?: string }>()
    const {onFetchNftsCreated} = useFetchUserNfts(userAddress)

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsCreated()
                setAssets(asses_)
            } catch (e) {
                setAssets([])
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsCreated])
    

    return (
        <Flex flexDirection="column">
            <Assets items={assets}/>
        </Flex>
    )
}

export default AssetsCreated