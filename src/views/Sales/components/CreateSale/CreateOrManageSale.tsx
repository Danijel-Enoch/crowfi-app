import React, { useState } from 'react'
import { useHistory, RouteComponentProps } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import CreateSale from './CreateSale'

const PageWrapper = styled(Flex)`
`



export enum ViewMode {
    CREATE = 'CREATE',
    MANAGE = 'MANAGE',
}

const CreateOrManageSale: React.FC<RouteComponentProps<{address?: string}>> = ({
    match: {
        params: {address: routeAddress}
    }
}) => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.CREATE)
    const history = useHistory()

    const onDisagree = () =>  {
        history.replace('/presale')
    }

    const renderContent = () => {
        if (viewMode === ViewMode.CREATE) {
            return <CreateSale onDisagree={onDisagree} routeAddress={routeAddress}/>
        }
        return <CreateSale onDisagree={onDisagree} routeAddress={routeAddress}/>
    }

    return (
        <>

            <PageWrapper>
                <Flex flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                    {renderContent()}
                    
                </Flex>
                
            </PageWrapper>
        </>
    )
}

export default CreateOrManageSale