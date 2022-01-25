import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Text, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import { usePollTokenFactoryData } from 'state/tokenFactory/hooks'
import AirdropperHeader from './componets/AirdropperHeader'
import CreateAirdropSection from './componets/CreateAirdropSection'

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
        return <CreateAirdropSection/>
    }

    return (
        <>
            <PageBGWrapper />
            <PageHeader>
                <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Airdropper')}
                </Heading>
                <Text color="white" style={{textShadow:"1px 2px rgba(255,255,255,0.2)"}}>
                {t('Airdrop your token to all your users with the click of a button')}
                </Text>
            </PageHeader>

            <PageWrapper>
                <StyledPageBody flexDirection="column" flex="1" margin={["0px 12px 24px 12px", null, null, "0px 24px 24px 24px"]}>

                    <AirdropperHeader tokens={4} network="Cronos"/>

                    {renderContent()}
                    
                </StyledPageBody>
                
            </PageWrapper>
        </>
    )
}

export default TokenFactory