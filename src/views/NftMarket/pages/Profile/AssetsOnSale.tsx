import React, { useEffect, useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import useRefresh from 'hooks/useRefresh'
import { useFetchMyProfile } from '../../hooks/useProfile'
import Assets from './Assets'

const AssetsOnSale: React.FC = () => {
    const [assets, setAssets] = useState([])
    const { slowRefresh } = useRefresh()
    const {onFetchNftsOnSale} = useFetchMyProfile()

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