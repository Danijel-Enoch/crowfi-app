import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'
import CreateTokenLocker from './CreateTokenLocker'
import CreateLiquidityLocker from './CreateLiquidityLocker'


export enum ViewMode {
    TOKEN = 'TOKEN',
    LIQUIDITY = 'LIQUIDITY',
}

const CreateLocker: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.TOKEN)

    const renderContent = () => {
        if (viewMode === ViewMode.TOKEN) {
            return <CreateTokenLocker/>
        }
        return <CreateLiquidityLocker />
    }

    const menuItems = ['Lock Token', 'Lock Liquidity']
    const menuItemsOnMobile = ['Token', 'Liquidity']

    const onMenuClick = (index: number) =>  {
        const nViewMode = index === 0 ? ViewMode.TOKEN : ViewMode.LIQUIDITY
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }

    return (
        <>

            <Flex flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>
                {/* <Flex flexDirection="column" alignItems="center">
                    <Heading color='primary' scale="xl" textAlign="center">
                        {t('Lock Liqudity or Token')}
                    </Heading>
                </Flex> */}

                <BoxButtonMenu onItemClick={onMenuClick} items={menuItems} mobileItems={menuItemsOnMobile}/>

                {renderContent()}
                
            </Flex>
        </>
    )
}

export default CreateLocker