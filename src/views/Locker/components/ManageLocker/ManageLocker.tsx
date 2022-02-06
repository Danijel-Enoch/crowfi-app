import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Flex, Text, Input, Skeleton } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import { useMyLiquidityLockCount, useMyLPLocks, useMyNormalLocks, useMyNormalLockCount, useTotalLockCount } from 'state/locker/hooks'
import { DeserializedLock } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useENS from 'hooks/ENS/useENS'
import BoxButtonMenu from 'components/BoxButtonMenu'
import { StyledAddressInput, StyledInput } from 'components/Launchpad/StyledControls'
import FlexLayout from 'components/Layout/Flex'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import LockerCard from './LockerCard'
import { findLocks, getLocks, getMyLocks } from '../../hooks/getLocks'


const SearchInput = styled(StyledInput)`
    width: min(100%, 500px);
`

export enum ViewMode {
    MYTOKEN = 'MYTOKEN',
    MYLIQUIDITY = 'MYLIQUIDITY',
    ALL = 'ALL',
}

export interface PageData {
    totalCount: number
    page: number
    data?: DeserializedLock[]
}

const ManageLocker: React.FC = () => {

    const { t } = useTranslation()
    const itemPerPage = 100;
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const [ viewMode, setViewMode ] = useState(ViewMode.MYTOKEN)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [pageData, setPageData] = useState<PageData>({
        totalCount: 0,
        page: 0,
        data: null
    })
    const { address: searchTokenAddress } = useENS(searchQuery)
    const totalLockCount = useTotalLockCount()
    const myNormalLockCount = useMyNormalLockCount()
    const myLPLockCount = useMyLiquidityLockCount()

    const menuItems = ['My Token Locker', 'My Liquidity Locker', 'View All Lockers']
    const menuItemsOnMobile = ['Token', 'Liquidity', 'All']

    const onMenuClick = (index: number) =>  {
        const allViewModes = [ViewMode.MYTOKEN, ViewMode.MYLIQUIDITY, ViewMode.ALL]
        const nViewMode = allViewModes[index]
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }
    
    useEffect(() => {

        const fetchLocks = async() =>  {
            try {
                setIsLoading(true)
                if (searchTokenAddress) {
                    const data = await findLocks(searchTokenAddress)
                    setPageData({data, page: 0, totalCount: myNormalLockCount})
                } else if (viewMode === ViewMode.MYTOKEN) {
                    if (account && myNormalLockCount > 0) {
                        const data = await getMyLocks(account, false, 0, Math.min(itemPerPage, myNormalLockCount))
                        setPageData({data, page: 0, totalCount: myNormalLockCount})
                    } else {
                        setPageData({data: undefined, page: 0, totalCount: 0})
                    }
                } else if (viewMode === ViewMode.MYLIQUIDITY) {
                    if (account && myLPLockCount > 0) {
                        const data = await getMyLocks(account, true, 0, Math.min(itemPerPage, myLPLockCount))
                        setPageData({data, page: 0, totalCount: myLPLockCount})
                    } else {
                        setPageData({data: undefined, page: 0, totalCount: 0})
                    }
                } else if (totalLockCount > 0) {
                        const data = await getLocks(0, Math.min(itemPerPage, totalLockCount))
                        setPageData({data, page: 0, totalCount: totalLockCount})
                } else {
                    setPageData({data: undefined, page: 0, totalCount: 0})
                }
            } catch (e) {
                console.log('e', e)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLocks()

    }, [dispatch, account, viewMode, totalLockCount, myNormalLockCount, myLPLockCount, pageData.page, itemPerPage, searchQuery, searchTokenAddress])

    const renderContent = () => {
        if (isLoading) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }

        return (
            <FlexLayout>
            {
                pageData.data ? pageData.data.map((lock) => (
                    <LockerCard 
                        key={lock.id}
                        lock={lock}
                    />
                )) 
                : null
            }
            </FlexLayout>
        )
    }

    return (
        <>
            <Flex flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection="column" alignItems="center">
                    {totalLockCount >= 0 ? (
                        <Heading color='primary' scale="xl" textAlign="center">
                            {totalLockCount}
                        </Heading>
                    ): (
                        <Skeleton width="100px" height="40px"/>
                    )}
                    
                    <Text color='secondary' textAlign="center">
                        {t('Lockers Created')}
                    </Text>
                </Flex>

                <BoxButtonMenu onItemClick={onMenuClick} items={menuItems} mobileItems={menuItemsOnMobile}/>

                <Flex justifyContent="center" mb="24px">
                    <Flex width="600px" maxWidth="calc(90vw - 20px)">
                        <StyledAddressInput 
                            value={searchQuery} 
                            placeholder={t('Search by  Token or LP Token Address')}
                            onUserInput={(value) => setSearchQuery(value)} />
                    </Flex>
                </Flex>

                {renderContent()}
                
            </Flex>
        </>
    )
}

export default ManageLocker