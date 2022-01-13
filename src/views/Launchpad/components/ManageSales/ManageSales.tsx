import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Flex, Text, Input } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'
import { StyledInput } from 'components/Launchpad/StyledControls'
import PageHeader from 'components/PageHeader'
import FlexLayout from 'components/Layout/Flex'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import SaleCard from './SaleCard'

const PageWrapper = styled(Flex)`
`

const StyledPageBody = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    padding: 24px;
    background: white;
    width: 100%;
    z-index: 1;
`

const SearchInput = styled(StyledInput)`
    width: min(100%, 500px);
`

interface Sale {
    id: string
    token?: Token
    usdPrice: BigNumber
    marketCapUsd: BigNumber
    soldUsd: BigNumber
    participants?: number
    startDate?: number
    endDate?: number
}

export enum ViewMode {
    VERIFIED = 'VERIFIED',
    OTHERS = 'OTHERS'
}

const ManageSales: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.VERIFIED)

    const menuItems = ['Verified Presales', 'Other Presales']
    const menuItemsOnMobile = ['Verified', 'Others']

    const onMenuClick = (index: number) =>  {
        const allViewModes = [ViewMode.VERIFIED, ViewMode.OTHERS]
        const nViewMode = allViewModes[index]
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }
    

    const verifiedSales: Sale[] = useMemo(() => {
        return [
            {
                id: '1',
                token: tokens.crow,
                usdPrice: new BigNumber(0.1),
                marketCapUsd: new BigNumber(10000),
                soldUsd: new BigNumber(100),
                participants: 99,
                startDate: 1642645616,
                endDate: 1647743216,
            },
            {
                id: '2',
                token: tokens.crow,
                usdPrice: new BigNumber(0.1),
                marketCapUsd: new BigNumber(582),
                soldUsd: new BigNumber(76),
                participants: 12,
                startDate: 1641998709,
                endDate: 1647743216,
            },
            {
                id: '3',
                token: tokens.crow,
                usdPrice: new BigNumber(0.1),
                marketCapUsd: new BigNumber(582),
                soldUsd: new BigNumber(76),
                participants: 12,
                startDate: 1641998709,
                endDate: 1641998709,
            }
        ]
    }, [])

    const otherSales: Sale[] = useMemo(() => {
        return [
        ]
    }, [])

    const videModeSales: Sale[] = useMemo(() => {
        if (viewMode === ViewMode.VERIFIED) {
            return verifiedSales
        }
        return otherSales
    }, [verifiedSales, otherSales, viewMode])

    const renderContent = () => (
        <FlexLayout>
        {
            videModeSales.map((sale) => (
                <SaleCard 
                    key={sale.id}
                    token={sale.token}
                    startDate={sale.startDate}
                    endDate={sale.endDate}
                    usdPrice={sale.usdPrice}
                    marketCapUsd={sale.marketCapUsd}
                    soldUsd={sale.soldUsd}
                    participants={sale.participants}
                />
            ))
        }
        </FlexLayout>
    )

    return (
        <>
            {/* <PageHeader>
            </PageHeader> */}

            <PageWrapper>
                <StyledPageBody flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                    <BoxButtonMenu onItemClick={onMenuClick} items={menuItems} mobileItems={menuItemsOnMobile}/>

                    {renderContent()}
                    
                </StyledPageBody>
                
            </PageWrapper>
        </>
    )
}

export default ManageSales