import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Flex, SubMenuItems, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import ManageLocker from './components/ManageLocker/ManageLocker'
import CreateLocker from './components/CreateLocker/CreateLocker'

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

const Locker: React.FC = () => {

    const { t } = useTranslation()
    const { path, url, isExact } = useRouteMatch()
    const { isMobile } = useMatchBreakpoints()
    const createPath = `${path}/create`
    const menuItems = [
        {
            label: "Manage Lockers",
            href: path,
        },
        {
            label: "Create Lockers",
            href: createPath,
        },
    ]
    const mobileMenuItems = [
        {
            label: "Manage",
            href: path,
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
                    <SubMenuItems items={!isMobile ? menuItems : mobileMenuItems} activeItem={isExact ? path : createPath}/>
                </Flex>
                <Route exact path={`${path}`}>
                <ManageLocker />
                </Route>
                <Route path={`${path}/create`} exact>
                <CreateLocker />
                </Route>
            </Container>
        </>
    )
}

export default Locker