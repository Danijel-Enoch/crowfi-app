import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Breadcrumbs, Flex, Text, ChevronRightIcon } from '@pancakeswap/uikit'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import SaleBaseSection from './SaleBaseSection'
import SaleActionSection from './SaleActionSection'
import SaleStatusSection from './SaleStatusSection'

const StyledSection = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    z-index: 1;
    padding: 16px;
    margin: 8px;
`

const SalePage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <PageBGWrapper />
            <Flex style={{padding: "24px 16px 12px 16px"}}>
                <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="white" width="24px" />}>
                <Link to="/presale">
                    <Text color="white">{t('Presale')}</Text>
                </Link>
                <Flex>
                    <Text mr="8px" color="rgba(255, 255, 255, 0.6)">VitCoin Presale</Text>
                </Flex>
                </Breadcrumbs>
            </Flex>
            <Flex flexDirection="row" flexWrap="wrap" style={{padding: "0px 8px 32px 0px"}}>
                <Flex flexDirection="column" flex={[1, 1, 1, 3]} width={['100%', '100%', '66%', '66%']}>
                    <StyledSection>
                        <SaleBaseSection />
                    </StyledSection>
                </Flex>
                <Flex flexDirection="column" flex={[1, 1, 1, 2]} width={['100%', '100%', '33%', '33%']}>
                    <StyledSection>
                        <SaleActionSection />
                    </StyledSection>
                    <StyledSection>
                        <SaleStatusSection />
                    </StyledSection>
                </Flex>
            </Flex>
        </>
    )
}

export default SalePage