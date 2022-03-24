import React, { useEffect, useState } from 'react'
import { Flex, } from '@pancakeswap/uikit'
import useRefresh from 'hooks/useRefresh'
import { useFetchMyProfile } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsCollected: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const {onFetchNftsCollected} = useFetchMyProfile()

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
        
    }, [slowRefresh, onFetchNftsCollected])
    

    return (
        <Flex flexDirection="column">
            <Assets items={assets}/>
        </Flex>
    )
}

export default AssetsCollected