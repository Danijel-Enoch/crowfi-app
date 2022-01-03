import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import PageSection from 'components/PageSection'
import Hero from './components/Hero'
import TVLSection from './components/TVLSection'
import AnnouncementSection from './components/AnnouncementSection'
import TradeSection from './components/TradeSection'
import MetaverseSection from './components/MetaverseSection'
import MobileAppSection from './components/MobileAppSection'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
import DeFiSection from './components/DeFiSection'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const PageWrapper = styled.div`
  background-size: cover;
  background-position: top center;
  padding-top: 16px;
  padding-bottom: 240px;
  margin-bottom: -240px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
}
`

const CloudBGWrapper = styled.div`
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background:url('/images/home/background.jpg');
  background-size: cover;
  opacity: 0.1;
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageMeta />
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='linear-gradient(180deg, #E7F1F8 20%, #FFF 100%)'
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='linear-gradient(180deg, #FFFFFF 22%, #ebf5f7 100%)'
        index={2}
        hasCurvedDivider={false}
      >
        <TVLSection />
      </PageSection>
      {/* <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        // background={theme.colors.secondary}
        background='linear-gradient(180deg, #004475 22%, #205d8f 100%)'
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top fill={theme.colors.primary}>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <AnnouncementSection />
      </PageSection> */}
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.secondary}
        // background = {
        //   isMobile
        //     ? 'linear-gradient(180deg, #205d8f 0%, #ebf5f7 100%)'
        //     : 'radial-gradient(#205d8f 0%, #428dcb 50%, #ebf5f7 70%)'
        // }
        index={2}
        hasCurvedDivider={false}
      >
        <DeFiSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <TradeSection />
      </PageSection>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        index={2}
        hasCurvedDivider={false}
      >
        <CloudBGWrapper />
        <MetaverseSection />
        <MobileAppSection />
      </PageSection>
      
    </>
  )
}

export default Home
