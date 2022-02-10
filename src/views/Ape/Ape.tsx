import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Heading, Text, Flex, Box } from '@pancakeswap/uikit'
import PageHeader from 'components/PageHeader'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import { DeserializedLock } from 'state/types'
import { usePollTokenFactoryData } from 'state/tokenFactory/hooks'
import { CronosPairToken } from './typs'
import TokensTable from './components/TokensTable'
import { getPairsByQuery } from './hooks/getTokensByQuery'
import { findTokensLocks } from './hooks/getLockesByTokens'

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
const Ape: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()
    const [loaded, setLoaded] = useState(false)
    const [pairs, setPairs] = useState<CronosPairToken[]>([])
    const [lockMap, setLockMap] = useState<Map<string, DeserializedLock[]>>(new Map<string, DeserializedLock[]>())

    useEffect(() => {
        const loadPairs = async () => {
            setLoaded(true)

            console.log('loading');
            const pairs_ = await getPairsByQuery();
            console.log('here', pairs_.length);
            setPairs(pairs_)

            const lockMap_ = await findTokensLocks(pairs_.map((pair) => pair.address))
            setLockMap(lockMap_)
        }

        if (!loaded) {
            loadPairs()
        }
    }, [loaded])
    

    return (
        <>
            <PageBGWrapper />
            <PageHeader>
                <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('New Pairs')}
                </Heading>
                <Text color="white" style={{textShadow:"1px 2px rgba(255,255,255,0.2)"}}>
                {t('Scan for new Cronos token launches.')}
                </Text>
            </PageHeader>

            <Container marginBottom="64px">
                <TokensTable pairs={pairs} lockMap={lockMap}/>
                
            </Container>
        </>
    )
}
export default Ape