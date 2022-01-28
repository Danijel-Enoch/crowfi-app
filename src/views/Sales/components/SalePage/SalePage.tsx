import React, { useCallback, useEffect, useState } from 'react'
import { Link, RouteComponentProps, Router } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from 'ethers/lib/utils'
import { Breadcrumbs, Flex, Text, ChevronRightIcon, Spinner, LogoIcon, Heading, Button } from '@pancakeswap/uikit'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import SaleBaseSection from './SaleBaseSection'
import SaleActionSection from './SaleActionSection'
import SaleStatusSection from './SaleStatusSection'
import { getSale, getSaleMeta } from '../../hooks/getSales'
import { PublicSaleData } from '../../types'
import SaleManageSection from './SaleManageSection'
import SaleEditMetaSection from './SaleEditMetaSection'
import SalePageContent from './SalePageContent'

const StyledSection = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    z-index: 1;
    padding: 16px;
    margin: 8px;
`
const SpinnerWrapper = styled(Flex)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const FullWidthFlex = styled(Flex)`
    width: 100%;
`
const BlankPage = styled.div`
    position:relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 540px);

    ${({ theme }) => theme.mediaQueries.sm} {
        padding-top: 32px;
        min-height: calc(100vh - 380px);
    }

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 32px;
        min-height: calc(100vh - 336px);
    }
`
enum ViewMode {
    VIEW,
    EDITMETA
}

const SalePage: React.FC<RouteComponentProps<{address: string}>> = ({
    match: {
        params: {address: routeAddress}
    }
}) => {
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const [sale, setSale] = useState<PublicSaleData|null>(null)
    const [loaded, setLoaded] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [viewMode, setViewMode] = useState(ViewMode.VIEW)

    const reloadSaleMeta = useCallback( async() => {
        const meta = await getSaleMeta(routeAddress)
        sale.meta = {...meta}
        sale.logo = meta.logo
        setSale(sale)
    }, [routeAddress, sale])

    useEffect(() => {
        const fetchSale = async() => {
            if (!isAddress(routeAddress)) {
                console.log('here', routeAddress)
                setIsValid(false)
                setLoaded(true)
                return
            }
            try {
                const sale_ = await getSale(routeAddress)
                if (!sale_) {
                    setIsValid(false)
                } else {
                    const meta = await getSaleMeta(routeAddress)
                    sale_.meta = {...meta}
                    sale_.logo = meta.logo
                    setIsValid(true)
                    setSale(sale_)
                }
            } catch (e) {
                setIsValid(false)
            }
            setLoaded(true)
        }

        if (!loaded) {
            fetchSale()
        }
        
    }, [routeAddress, reloadSaleMeta, loaded])

    const renderContent = () =>  {
        if (viewMode === ViewMode.VIEW) {
            return <SalePageContent account={account} address={routeAddress} sale={sale} onEditMeta={() => setViewMode(ViewMode.EDITMETA)} />
        }

        return <SaleEditMetaSection sale={sale} address={routeAddress} account={account} onBack={() => setViewMode(ViewMode.VIEW)} onUpdatedMeta={reloadSaleMeta}/>

    }
    
    return (
        <>
            <PageBGWrapper />

            { !loaded && (
                <BlankPage>
                    <SpinnerWrapper >
                        <FullWidthFlex justifyContent="center" alignItems="center">
                            <Spinner />
                        </FullWidthFlex>
                    </SpinnerWrapper>
                </BlankPage>
            )}

            { loaded && !isValid && (
                <BlankPage>
                    <LogoIcon width="64px" mb="8px" />
                    <Heading scale="xxl">404</Heading>
                    <Text mb="16px">{t('Oops, page not found.')}</Text>
                    <Button as={Link} to="/" scale="sm">
                    {t('Back Home')}
                    </Button>
                </BlankPage>
            )}

            { loaded && isValid && renderContent()}
            
        </>
    )
}

export default SalePage