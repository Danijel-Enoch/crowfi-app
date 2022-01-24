import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Flex, Text, Input } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'
import { StyledInput } from 'components/Launchpad/StyledControls'
import FlexLayout from 'components/Layout/Flex'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import LockerCard from './LockerCard'


const SearchInput = styled(StyledInput)`
    width: min(100%, 500px);
`

interface Locker {
    token: Token
    owner?: string
    unlockAt: number
    totalSupply: BigNumber
    lockedAmount: BigNumber
    unlocked: boolean
}

export enum ViewMode {
    MYTOKEN = 'MYTOKEN',
    MYLIQUIDITY = 'MYLIQUIDITY',
    ALL = 'ALL',
}

const ManageLocker: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [ viewMode, setViewMode ] = useState(ViewMode.MYTOKEN)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const debouncedQuery = useDebounce(searchQuery, 200)
    const inputRef = useRef<HTMLInputElement>()
    useEffect(() => {
        inputRef.current.focus()
    }, [])

    const menuItems = ['My Token Locker', 'My Liquidity Locker', 'View All Lockers']
    const menuItemsOnMobile = ['Token', 'Liquidity', 'All']

    const onMenuClick = (index: number) =>  {
        const allViewModes = [ViewMode.MYTOKEN, ViewMode.MYLIQUIDITY, ViewMode.ALL]
        const nViewMode = allViewModes[index]
        if (nViewMode !== viewMode) {
            setViewMode(nViewMode)
        }
    }

    const handleInput = useCallback((event) => {
        const input = event.target.value
        const checksummedInput = isAddress(input)
        setSearchQuery(checksummedInput || input)
      }, [])
    
    // const handleEnter = useCallback(
    //     (e: KeyboardEvent<HTMLInputElement>) => {
    //         if (e.key === 'Enter') {
    //         const s = debouncedQuery.toLowerCase().trim()
    //         if (s === 'cro') {
    //             handleCurrencySelect(ETHER)
    //         } else if (filteredSortedTokens.length > 0) {
    //             if (
    //             filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
    //             filteredSortedTokens.length === 1
    //             ) {
    //             handleCurrencySelect(filteredSortedTokens[0])
    //             }
    //         }
    //         }
    //     },
    //     [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
    // )

    const myLockers: Locker[] = useMemo(() => {
        return [
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            },
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            },
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            }
        ]
    }, [])

    const allLockers: Locker[] = useMemo(() => {
        return [
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            },
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
                owner: '0xA2c8e14B7Cc468131C2c1d409b58Be9E344701e4'
            },
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            },
            {
                token: tokens.crow,
                totalSupply: new BigNumber(100000000000000000000000),
                lockedAmount: new BigNumber(100000000000000000000),
                unlockAt: 1647096309,
                unlocked: false,
            }
        ]
    }, [])

    const viewModeLockers: Locker[] = useMemo(() => {
        if (viewMode === ViewMode.MYTOKEN) {
            return myLockers
        }
        if (viewMode === ViewMode.MYLIQUIDITY) {
            return myLockers
        }
        return allLockers
    }, [myLockers, allLockers, viewMode])

    const filteredLockers: Locker[] = useMemo(() => {
        return viewModeLockers.filter((locker) => {
            return locker.token.address.toLowerCase().startsWith(debouncedQuery.toLowerCase())
                || locker.token.name.toLowerCase().includes(debouncedQuery.toLowerCase())
                || locker.token.symbol.toLowerCase().includes(debouncedQuery.toLowerCase())
        })
    }, [viewModeLockers, debouncedQuery])

    const renderContent = () => (
        <FlexLayout>
        {
            filteredLockers.map((locker) => (
                <LockerCard 
                    token={locker.token} 
                    owner={locker.owner}
                    unlockAt={locker.unlockAt}
                    unlocked={locker.unlocked}
                    lockedAmount={locker.lockedAmount}
                    totalSupply={locker.totalSupply}
                />
            ))
        }
        </FlexLayout>
    )

    return (
        <>
            <Flex flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection="column" alignItems="center">
                    <Heading color='primary' scale="xl" textAlign="center">
                        {2}
                    </Heading>
                    <Text color='secondary' textAlign="center">
                        {t('Lockers Created')}
                    </Text>
                </Flex>

                <BoxButtonMenu onItemClick={onMenuClick} items={menuItems} mobileItems={menuItemsOnMobile}/>

                <Flex justifyContent="center" mb="24px">
                    <SearchInput
                        id="token-search-input"
                        placeholder={t('Search by Token Address, name or symbol')}
                        scale="lg"
                        autoComplete="off"
                        value={searchQuery}
                        ref={inputRef as RefObject<HTMLInputElement>}
                        onChange={handleInput}
                    />
                </Flex>

                {renderContent()}
                
            </Flex>
        </>
    )
}

export default ManageLocker