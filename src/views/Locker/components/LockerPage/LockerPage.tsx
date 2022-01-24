import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Breadcrumbs, Flex, Text, ChevronRightIcon } from '@pancakeswap/uikit'
import { PageBGWrapper } from 'components/Launchpad/StyledControls'
import { useTranslation } from 'contexts/Localization'
import LockerBaseSection from './LockerBaseSection'
import LockerActionSection from './LockerActionSection'
import LockerStatusSection from './LockerStatusSection'

const StyledSection = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    z-index: 1;
    padding: 16px;
    margin: 8px;
`

const LockerPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <PageBGWrapper />
            <Flex style={{padding: "12px 16px"}}>
                <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="white" width="24px" />}>
                <Link to="/utilities/lockers">
                    <Text color="white">{t('Lockers')}</Text>
                </Link>
                <Flex>
                    <Text mr="8px" color="rgba(255, 255, 255, 0.6)">CrowFi Token</Text>
                </Flex>
                </Breadcrumbs>
            </Flex>
            <Flex flexDirection="row" flexWrap="wrap" style={{padding: "0px 8px 32px 0px"}}>
                <Flex flexDirection="column" flex={[1, 1, 1, 3]} width={['100%', '100%', '66%', '66%']}>
                    <StyledSection>
                        <LockerBaseSection />
                    </StyledSection>
                </Flex>
                <Flex flexDirection="column" flex={[1, 1, 1, 2]} width={['100%', '100%', '33%', '33%']}>
                    <StyledSection>
                        <LockerActionSection />
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