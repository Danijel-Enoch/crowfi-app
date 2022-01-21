import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Text, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import { usePollTokenFactoryData } from 'state/tokenFactory/hooks'
import TokenFactoryHeader from './components/TokenFactoryHeader'
import TokenFactoryNav from './components/TokenFactoryNav'
import CreateTokenSection from './components/CreateTokenSection'
import ManageTokenSection from './components/MangeTokenSection'

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


export enum ViewMode {
    CREATE = 'CREATE',
    MANAGE = 'MANAGE',
}

const TokenFactory: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.CREATE)

    usePollTokenFactoryData()

    const renderContent = () => {
        if (viewMode === ViewMode.CREATE) {
            return <CreateTokenSection/>
        }
        return <ManageTokenSection />
    }

    const onMenuClick = (index: number) =>  {
        const nViewMode = index === 0 ? ViewMode.CREATE : ViewMode.MANAGE
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }

    return (
        <>
            <PageBGWrapper />
            <PageHeader>
                <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Token Factory')}
                </Heading>
                <Text color="white" style={{textShadow:"1px 2px rgba(255,255,255,0.2)"}}>
                {t('Create Or Manage Your Own Token')}
                </Text>
            </PageHeader>

            <PageWrapper>
                <StyledPageBody flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                    <TokenFactoryHeader tokens={4} network="Cronos"/>

                    <TokenFactoryNav onItemClick={onMenuClick}/>

                    {renderContent()}
                    
                </StyledPageBody>
                
            </PageWrapper>
        </>
    )
}

export default TokenFactory