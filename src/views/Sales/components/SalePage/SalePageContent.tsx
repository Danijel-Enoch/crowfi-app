import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from 'ethers/lib/utils'
import { Breadcrumbs, Flex, Text, ChevronRightIcon, Spinner, LogoIcon, Heading, Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import SaleBaseSection from './SaleBaseSection'
import SaleActionSection from './SaleActionSection'
import SaleStatusSection from './SaleStatusSection'
import { getSale } from '../../hooks/getSales'
import { PublicSaleData, SaleContractVersion } from '../../types'
import SaleManageSection from './SaleManageSection'
import SaleEditMetaSection from './SaleEditMetaSection'
import SaleWhitelistSection from './SaleWhitelistSection'
import SaleAirdropSection from './SaleAirdropSection'

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
export interface SalePageContentProps {
    account?: string
    address: string
    sale?: PublicSaleData
    onEditMeta?: () => void
    onReloadSale?: () => void
    onWhitelistChanged?: (enabled: boolean) => void
}

const SalePageContent: React.FC<SalePageContentProps> = ({
    account, address, sale, onEditMeta, onReloadSale, onWhitelistChanged
}) => {
    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints()
    
    return (
        <>
            <Flex style={{padding: "24px 16px 12px 16px"}}>
                <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="white" width="24px" />}>
                <Link to="/presale">
                    <Text color="white">{t('Presale')}</Text>
                </Link>
                <Flex>
                    <Text mr="8px" color="rgba(255, 255, 255, 0.6)">{ isMobile ? truncateHash(address) : address}</Text>
                </Flex>
                </Breadcrumbs>
            </Flex>
            { sale && (
                <Flex flexDirection="row" flexWrap="wrap" style={{padding: "0px 8px 32px 0px"}}>
                    <Flex flexDirection="column" flex={[1, 1, 1, 3]} width={['100%', '100%', '66%', '66%']}>
                        <StyledSection>
                            <SaleBaseSection sale={sale} account={account} onEditMeta={onEditMeta}/>
                        </StyledSection>
                    </Flex>
                    <Flex flexDirection="column" flex={[1, 1, 1, 2]} width={['100%', '100%', '33%', '33%']}>
                        { account === sale.owner ? (
                            <>
                            <StyledSection>
                                <SaleManageSection sale={sale} account={account} onReloadSale={onReloadSale}/>
                            </StyledSection>
                            { !sale.canceled && !sale.finalized && (
                                <StyledSection>
                                    <SaleWhitelistSection sale={sale} account={account} onReloadSale={onReloadSale}/>
                                </StyledSection>
                            )}
                            { !sale.canceled && !sale.finalized && sale.version !== SaleContractVersion.DEFAULT &&  (
                                <StyledSection>
                                    <SaleAirdropSection sale={sale} account={account} onReloadSale={onReloadSale}/>
                                </StyledSection>
                            )}
                            </>
                        ) : (
                            <StyledSection>
                                <SaleActionSection sale={sale} account={account} onReloadSale={onReloadSale}/>
                            </StyledSection>
                        )}
                        <StyledSection>
                            <SaleStatusSection sale={sale}/>
                        </StyledSection>
                    </Flex>
                </Flex>
            )}
        </>
    )
}

export default SalePageContent