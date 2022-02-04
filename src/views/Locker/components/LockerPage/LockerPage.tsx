import React, { useCallback, useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Breadcrumbs, Flex, Text, ChevronRightIcon } from '@pancakeswap/uikit'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import { DeserializedLock, LockType } from 'state/types'
import { useToken, usePairToken } from 'hooks/Tokens'
import LockerBaseSection from './LockerBaseSection'
import LockerActionSection from './LockerActionSection'
import LockerStatusSection from './LockerStatusSection'
import { getLock } from '../../hooks/getLocks'

const StyledSection = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    z-index: 1;
    padding: 16px;
    margin: 8px;
`

const LockerPage: React.FC<RouteComponentProps<{address: string}>> = ({
    match: {
        params: {address: routeAddress}
    }
}) => {
    const address = routeAddress.toLowerCase()
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const [lock, setLock] = useState<DeserializedLock|null>(null)
    const token = useToken(lock? lock.tokenAddress : null)
    const pairToken = usePairToken( lock ? lock.tokenAddress : null)

    useEffect(() => {
        const loadLock = async () => {
            try {
                const lock_ = await getLock(parseInt(address))
                setLock(lock_)
            } catch (e) {
                console.log('e', e)
            }
            
        }
        if (!lock) {
            loadLock()
        }
    }, [lock, address])

    const onUpdateLock = useCallback( (l: DeserializedLock) => {
        setLock(l)
    }, [])
    return (
        <>
            <PageBGWrapper />
            <Flex style={{padding: "12px 16px"}}>
                <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="white" width="24px" />}>
                <Link to="/lockers">
                    <Text color="white">{t('Lockers')}</Text>
                </Link>
                <Flex>
                    <Text mr="8px" color="rgba(255, 255, 255, 0.6)">Locker #{lock ? lock.id : ''}</Text>
                </Flex>
                </Breadcrumbs>
            </Flex>
            <Flex flexDirection="row" flexWrap="wrap" style={{padding: "0px 8px 32px 0px"}}>
                <Flex flexDirection="column" flex={[1, 1, 1, 3]} width={['100%', '100%', '66%', '66%']}>
                    <StyledSection>
                        <LockerBaseSection pairToken={pairToken} token={token} lock={lock}/>
                    </StyledSection>
                </Flex>
                <Flex flexDirection="column" flex={[1, 1, 1, 2]} width={['100%', '100%', '33%', '33%']}>
                    <StyledSection>
                        <LockerActionSection lock={lock} account={account} token={token} updateLock={onUpdateLock}/>
                    </StyledSection>
                    {/* <StyledSection>
                        <LockerStatusSection />
                    </StyledSection> */}
                </Flex>
            </Flex>
        </>
    )
}

export default LockerPage