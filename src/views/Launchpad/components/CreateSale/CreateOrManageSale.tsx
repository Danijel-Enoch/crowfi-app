import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'
import CreateSale from './CreateSale'
// import CreateLiquidityLocker from './CreateLiquidityLocker'

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

const CreateOrManageSale: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.CREATE)

    const renderContent = () => {
        if (viewMode === ViewMode.CREATE) {
            return <CreateSale/>
        }
        return <CreateSale />
    }

    return (
        <>
            {/* <PageHeader>
                <Heading as="h1" scale="xl" color="secondary">
                {t('Lockers')}
                </Heading>
                <Text color="secondary">
                {t('Create Lockers')}
                </Text>
            </PageHeader> */}

            <PageWrapper>
                <StyledPageBody flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                    {renderContent()}
                    
                </StyledPageBody>
                
            </PageWrapper>
        </>
    )
}

export default CreateOrManageSale