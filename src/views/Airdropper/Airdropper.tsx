import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Text, Flex } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
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
            <PageHeader>
                <Heading as="h1" scale="xl" color="secondary">
                {t('Airdropper')}
                </Heading>
                <Text color="secondary">
                {t('Airdrop your token to all your users with the click of a button')}
                </Text>
            </PageHeader>

            <PageWrapper>
                <StyledPageBody flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                    <AirdropperHeader tokens={4} network="Cronos"/>

                    {renderContent()}
                    
                </StyledPageBody>
                
            </PageWrapper>
        </>
    )
}

export default TokenFactory