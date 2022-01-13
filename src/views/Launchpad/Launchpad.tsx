import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Flex, SubMenuItems, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ManageSales from './components/ManageSales/ManageSales'
import CreateOrManageSale from './components/CreateSale/CreateOrManageSale'

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
    TOKEN = 'TOKEN',
    LIQUIDITY = 'LIQUIDITY',
}

const Launchpad: React.FC = () => {

    const { t } = useTranslation()
    const { path, url, isExact } = useRouteMatch()
    const { isMobile } = useMatchBreakpoints()
    const listPath = path
    const createPath = `${path}/create`
    const menuItems = [
        {
            label: "Launches",
            href: listPath,
        },
        {
            label: "Start Sale",
            href: createPath,
        },
    ]
    const mobileMenuItems = [
        {
            label: "Launches",
            href: listPath,
        },
        {
            label: "Create",
            href: createPath,
        },
    ]

    return (
        <>
            <Container>
                <Flex justifyContent="center" alignItems="center" mb="32px">
                    <SubMenuItems items={!isMobile ? menuItems : mobileMenuItems} activeItem={isExact ? listPath : createPath}/>
                </Flex>
                <Route exact path={listPath}>
                <ManageSales />
                </Route>
                <Route path={createPath}>
                <CreateOrManageSale />
                </Route>
            </Container>
        </>
    )
}

export default Launchpad