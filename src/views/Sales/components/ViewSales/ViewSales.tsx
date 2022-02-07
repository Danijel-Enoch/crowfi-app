import React, {useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'
import FlexLayout from 'components/Layout/Flex'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import useENS from 'hooks/ENS/useENS'
import { useTotalSaleCount } from 'state/launchpad/hooks'
import SaleCard from './SaleCard'
import { findSales, getSales, getUserSales } from '../../hooks/getSales'
import { getMyContributions } from '../../hooks/getSalesByQuery'    
import { PublicSaleData } from '../../types'

export enum ViewMode {
    ALL = 'ALL',
    OWNER = 'OWNER',
    CONTRIBUTOR = 'CONTRIBUTOR'
}

export interface PageData {
    totalCount: number
    page: number
    data?: PublicSaleData[]
}

const ViewSales: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const itemPerPage = 100;
    const [ viewMode, setViewMode ] = useState(ViewMode.ALL)
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [pageData, setPageData] = useState<PageData>({
        totalCount: 0,
        page: 0,
        data: null
    })
    const { address: searchTokenAddress } = useENS(searchQuery)
    const totalSaleCount = useTotalSaleCount()

    const menuItems = ['All Presales', 'My Presales', 'My Contributions']
    const menuItemsOnMobile = ['All Presales', 'My Presales', 'My Contributions']

    const onMenuClick = (index: number) =>  {
        const allViewModes = [ViewMode.ALL, ViewMode.OWNER, ViewMode.CONTRIBUTOR]
        const nViewMode = allViewModes[index]
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }

    
    useEffect(() => {

        const fetchSales = async() =>  {
            try {
                setIsLoading(true)
                if (searchTokenAddress) {
                    const data = await findSales(searchTokenAddress)
                    setPageData({data, page: 0, totalCount: totalSaleCount})
                } else if (viewMode === ViewMode.OWNER) {
                    if (account && totalSaleCount > 0) {
                        const data = await getUserSales(account)
                        setPageData({data, page: 0, totalCount: totalSaleCount})
                    } else {
                        setPageData({data: undefined, page: 0, totalCount: 0})
                    }
                } else if (viewMode === ViewMode.CONTRIBUTOR) {
                    if (account && totalSaleCount > 0) {
                        const res = await getMyContributions(account);
                        setPageData({data:res, page: 0, totalCount: totalSaleCount})
                    } else {
                        setPageData({data: undefined, page: 0, totalCount: 0})
                    }
                } else if (totalSaleCount > 0) {
                        const data = await getSales(0, Math.min(itemPerPage, totalSaleCount))
                        setPageData({data, page: 0, totalCount: totalSaleCount})
                } else {
                    setPageData({data: undefined, page: 0, totalCount: 0})
                }
            } catch (e) {
                console.log('e', e)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSales()

    }, [dispatch, account, viewMode, totalSaleCount, pageData.page, itemPerPage, searchTokenAddress])

    const renderContent = () => {
        if (isLoading) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }

        return (
            <FlexLayout>
            {
                pageData.data ? pageData.data.map((sale) => (
                    <SaleCard 
                        key={sale.address}
                        sale={sale}
                    />
                )) 
                : null
            }
            </FlexLayout>
        )
    }

    return (
        <>
            <Flex flexDirection="column" margin={["12px", "12px", "12px", "24px"]}>
            <Flex flexDirection="column" alignItems="center">
                {totalSaleCount >= 0 ? (
                    <Heading color='primary' scale="xl" textAlign="center">
                        {totalSaleCount}
                    </Heading>
                ): (
                    <Skeleton width="100px" height="40px"/>
                )}
                
                <Text color='secondary' textAlign="center">
                    {t('Presales Created')}
                </Text>
            </Flex>
            <BoxButtonMenu onItemClick={onMenuClick} items={menuItems} mobileItems={menuItemsOnMobile}/>

            {renderContent()}

            </Flex>
        </>
    )
}

export default ViewSales