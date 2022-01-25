import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Flex, Heading, SubMenuItems, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { TabToggle2, TabToggleGroup2 } from 'components/TabToggle2'
import ViewSales from './components/ViewSales/ViewSales'
import CreateOrManageSale from './components/CreateSale/CreateOrManageSale'

const PageWrapper = styled(Flex)`
`

const StyledPageBody = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    width: 100%;
    z-index: 1;
`



export enum ViewMode {
    CREATE = 'CREATE',
    VIEW = 'VIEW',
}

const Sales: React.FC = () => {

    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.VIEW)
    
    const renderContent = () => {
        if (viewMode === ViewMode.CREATE) {
            return <CreateOrManageSale onDisagree={() => setViewMode(ViewMode.VIEW)}/>
        }
        return <ViewSales/>
    }

    return (
        <>
            <PageBGWrapper />
            <PageHeader>
                <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Sales')}
                </Heading>
                <Text color="white" style={{textShadow:"1px 2px rgba(255,255,255,0.2)"}}>
                {t('Use Locker to lock your tokens or liquidity and earn greater trust within your community!')}
                </Text>
            </PageHeader>
            <PageWrapper>

                <StyledPageBody flexDirection="column" flex="1" margin={["0px 12px 24px 12px", null, null, "0px 24px 24px 24px"]}>
                    <TabToggleGroup2>
                        <TabToggle2 isActive={viewMode === ViewMode.VIEW} onClick={() => setViewMode(ViewMode.VIEW)}>
                            <Text>{t('Sales')}</Text>
                        </TabToggle2>
                        <TabToggle2 isActive={viewMode === ViewMode.CREATE} onClick={() => setViewMode(ViewMode.CREATE)}>
                            <Text>{t('Create or Manage')}</Text>
                        </TabToggle2>
                    </TabToggleGroup2>

                    {renderContent()}
                </StyledPageBody>

            </PageWrapper>
        </>
    )
}

export default Sales