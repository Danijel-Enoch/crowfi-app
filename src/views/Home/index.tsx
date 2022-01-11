import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
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

const HomeBodyStyle = createGlobalStyle`
  body {
    background-color: #002338;
  }
`

const StyledHeroSection = styled(PageSection)`
  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const DefiBGWrapper = styled.div`
  position: absolute;
  top:70px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-image:url('/images/home/home_bg3.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center top;

  ${({ theme }) => theme.mediaQueries.md} {
    top:100px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`
const HeroImageBGWrapper = styled.div`
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-image:url('/images/home/home_bg1.jpg');
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: right top;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
    background-position: center top;
    background-size: cover;
  }
`

const HeroBGWrapper = styled.div`
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,rgb(0,35,56,0) 90%,rgb(0,35,56) 99%,rgb(0,35,56) 100%);
`
const TradeBGImageWrapper = styled.div`
  position: absolute;
  top:100px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-image:url('/images/home/home_bg2.jpg');
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: right top;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
    background-position: center top;
    background-size: cover;
  }
`
const TradeBGWrapper = styled.div`
  position: absolute;
  top:100px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,rgb(102, 175, 188,0) 92%,rgb(102, 175, 188) 99%,rgb(102, 175, 188) 100%);
`

const Moon = styled.div`
    position: absolute;
    top: 30%;
    right: 20%;
    width: 60px;
    height: 60px;
    border-radius: 60px;
    z-index: -1;
    box-shadow: 0 0 120px 30px #fff; 
    > img {
      width: 100%;
      height: 100%;
    }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageMeta />
      <HomeBodyStyle />
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='linear-gradient(180deg, rgb(0,35,56,0.1) 90%, rgb(0,35,56) 100%)'
        index={2}
        hasCurvedDivider={false}
      >
        <HeroImageBGWrapper />
        <HeroBGWrapper />
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='transparent'
        index={2}
        hasCurvedDivider={false}
      >
        <DefiBGWrapper />
        <TVLSection />
        <DeFiSection />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background='transparent'
        index={2}
        hasCurvedDivider={false}
      >
        <TradeBGImageWrapper/>
        <TradeBGWrapper/>
        <Moon>
          <img src="/images/home/moon.png" alt=""/>
        </Moon>
        <TradeSection />
        <MetaverseSection />
      </PageSection>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background='#66afbc'
        index={2}
        hasCurvedDivider={false}
      >
        <MobileAppSection/>
      </PageSection>
      
    </>
  )
}

export default Home
