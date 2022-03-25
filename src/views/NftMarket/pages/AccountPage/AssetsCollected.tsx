import React, { useEffect, useState } from 'react'
import { Flex, } from '@pancakeswap/uikit'
import { useParams } from 'react-router-dom'
import useRefresh from 'hooks/useRefresh'
import { useFetchUserNfts } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsCollected: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const { address: userAddress } = useParams<{ address?: string }>()
    const {onFetchNftsCollected} = useFetchUserNfts(userAddress)


    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsCollected()
                setAssets(asses_)
            } catch (e) {
                setAssets([])
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsCollected, userAddress])
    

    return (
        <Flex flexDirection="column">
            <Assets items={assets}/>
        </Flex>
    )
}

export default AssetsCollected