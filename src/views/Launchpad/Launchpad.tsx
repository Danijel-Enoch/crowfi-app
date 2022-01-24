import React, { useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Flex, SubMenuItems, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Sales from 'views/Sales'
import TokenFactory from 'views/TokenFactory'
import Airdropper from 'views/Airdropper'
import Locker from 'views/Locker'
import SalePage from 'views/Sales/components/SalePage/SalePage'
import LockerPage from 'views/Locker/components/LockerPage/LockerPage'
import LaunchpadDashboard from './LaunchpadDashboard'

export enum ViewMode {
    TOKEN = 'TOKEN',
    LIQUIDITY = 'LIQUIDITY',
}

const Launchpad: React.FC = () => {

    const { t } = useTranslation()
    const { path, url, isExact } = useRouteMatch()
    const { isMobile } = useMatchBreakpoints()
    const isTokenFactory = useRouteMatch(['/utilities/token-factory'])
    const isAirdropper = useRouteMatch(['/utilities/airdropper'])
    const isLocker = useRouteMatch(['/utilities/lockers'])
    const mainPath = path
    const tokenFactoryPath = `${path}/token-factory`
    const airdropperPath = `${path}/airdropper`
    const lockerPath = `${path}/lockers`
    const menuItems = [
        {
            label: "Token Factory",
            href: tokenFactoryPath,
        },
        {
            label: "Lockers",
            href: lockerPath,
        },
        {
            label: "Airdropper",
            href: airdropperPath,
        },
    ]
    const mobileMenuItems = [
        {
            label: "Token Factory",
            href: tokenFactoryPath,
        },
        {
            label: "Lockers",
            href: lockerPath,
        },
        {
            label: "Airdropper",
            href: airdropperPath,
        },
    ]

    let activeIndex = 0
    if (isTokenFactory) {
        activeIndex = 0
    } else if (isLocker) {
        activeIndex = 1
    } else if (isAirdropper) {
        activeIndex = 2
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
                <Route path={tokenFactoryPath}>
                <TokenFactory />
                </Route>
                <Route path={airdropperPath}>
                <Airdropper />
                </Route>
                <Route exact path={lockerPath}>
                <Locker />
                </Route>
                <Route exact path={['/utilities/lockers/:address']} component={LockerPage} />
            </Flex>
        </>
    )
}

export default Launchpad