import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Flex, SubMenuItems, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Sales from 'views/Sales'
import TokenFactory from 'views/TokenFactory'
import Airdropper from 'views/Airdropper'
import Locker from 'views/Locker'
import LaunchpadDashboard from './LaunchpadDashboard'

export enum ViewMode {
    TOKEN = 'TOKEN',
    LIQUIDITY = 'LIQUIDITY',
}

const Launchpad: React.FC = () => {

    const { t } = useTranslation()
    const { path, url, isExact } = useRouteMatch()
    const { isMobile } = useMatchBreakpoints()
    const isSales = useRouteMatch(['/launchpad/sales'])
    const isTokenFactory = useRouteMatch(['/launchpad/token-factory'])
    const isAirdropper = useRouteMatch(['/launchpad/airdropper'])
    const isLocker = useRouteMatch(['/launchpad/lockers'])
    const mainPath = path
    const salesPath = `${path}/sales`
    const tokenFactoryPath = `${path}/token-factory`
    const airdropperPath = `${path}/airdropper`
    const lockerPath = `${path}/lockers`
    const menuItems = [
        {
            label: "Overview",
            href: mainPath,
        },
        {
            label: "Token Factory",
            href: tokenFactoryPath,
        },
        {
            label: "Airdropper",
            href: airdropperPath,
        },
        {
            label: "Sales",
            href: salesPath,
        },
        {
            label: "Lockers",
            href: lockerPath,
        },
    ]
    const mobileMenuItems = [
        {
            label: "Overview",
            href: mainPath,
        },
        {
            label: "Token Factory",
            href: tokenFactoryPath,
        },
        {
            label: "Airdropper",
            href: airdropperPath,
        },
        {
            label: "Sales",
            href: salesPath,
        },
        {
            label: "Lockers",
            href: lockerPath,
        },
    ]

    let activeIndex = 0
    if (isTokenFactory) {
        activeIndex = 1
    } else if (isAirdropper) {
        activeIndex = 2
    } else if (isSales) {
        activeIndex = 3
    } else if (isLocker) {
        activeIndex = 4
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex justifyContent="center" alignItems="center" mb="32px">
                    <SubMenuItems items={!isMobile ? menuItems : mobileMenuItems} activeItem={menuItems[activeIndex].href}/>
                </Flex>
                <Route exact path={mainPath}>
                <LaunchpadDashboard />
                </Route>
                <Route path={salesPath}>
                <Sales />
                </Route>
                <Route path={tokenFactoryPath}>
                <TokenFactory />
                </Route>
                <Route path={airdropperPath}>
                <Airdropper />
                </Route>
                <Route path={lockerPath}>
                <Locker />
                </Route>
            </Flex>
        </>
    )
}

export default Launchpad