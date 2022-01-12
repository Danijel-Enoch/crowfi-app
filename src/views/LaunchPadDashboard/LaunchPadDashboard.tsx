import { Heading } from '@pancakeswap/uikit'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import AirdropSection from './components/AirdropSection'
import Hero from './components/Hero'
import LockerSection from './components/LockerSection'
import PresaleSection from './components/PresaleSection'
import TokenFactorySection from './components/TokenFactorySection'


const LaunchPadDashboard: React.FC = () => {

    const theme = useTheme()
    const { t } = useTranslation()

    return (
        <>
            <PageSection
                innerProps={{ style: { margin: '0', width: '100%' } }}
                background='linear-gradient(180deg, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 0.3) 100%)'
                index={2}
                hasCurvedDivider={false}
            >
                <Hero />
            </PageSection>
            <PageSection
                innerProps={{ style: { margin: '0', width: '100%' } }}
                background='linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.3) 100%)'
                index={2}
                hasCurvedDivider={false}
            >
                <TokenFactorySection />
            </PageSection>
            <PageSection
                innerProps={{ style: { margin: '0', width: '100%' } }}
                background='linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.6) 100%)'
                index={2}
                hasCurvedDivider={false}
            >
                <PresaleSection />
            </PageSection>
            <PageSection
                innerProps={{ style: { margin: '0', width: '100%' } }}
                background='linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 100%)'
                index={2}
                hasCurvedDivider={false}
            >
                <LockerSection />
            </PageSection>
            <PageSection
                innerProps={{ style: { margin: '0', width: '100%' } }}
                background='linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)'
                index={2}
                hasCurvedDivider={false}
            >
                <AirdropSection />
            </PageSection>
        </>
    )
}

export default LaunchPadDashboard