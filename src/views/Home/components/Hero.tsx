import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'
import LaunchButton from './LaunchButton'


const WhiteLogo = styled(Flex)`
  justify-content:center;
  align-items:center;
  width: 70px;
  height: 70px;
  background-color: transparent;
  border-radius:35px;
  border: 3px solid white;
  padding: 6px;


  ${({ theme }) => theme.mediaQueries.md} {
    width: 140px;
    height: 140px;
    border-radius:70px;
    border: 4px solid white;
    padding: 12px;
  }
`

const Line = styled.div`

  ${({ theme }) => theme.mediaQueries.md} {
    height:6px;
    margin-left: 10px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

const SubHeadingWrapper = styled(Flex)`
  margin-top: 4em;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 8em;
    border-radius: 80px 0px 0px 80px;
    padding: 10px 30px 10px 30px;
  }
`

const Hero = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex={[1, null, null, 3]}  flexDirection="column" justifyContent="center" alignItems="center" />
        <Flex flex={[1, null, null, 4]} flexDirection="column" alignItems={["center", "cener", "center", "end"]}>
          <Flex flexDirection="column" pr={['0', null, '30px']}>
            <Flex alignItems="center" justifyContent={["center", "cener", "center", "flex-start"]}>
              <LandingHeading scale="md" color="white">
                {t('WE ARE')}
              </LandingHeading>
            </Flex>
            
            <Flex flexDirection="row" alignItems="center">
              <Flex flexDirection="column" alignItems="end">
                <LandingHeading scale="xl" color="white">
                  {t('CROW')}
                </LandingHeading>
                <LandingHeading scale="lg" color="white">
                  {t('FINANCE')}
                </LandingHeading>
              </Flex>
              <WhiteLogo>
                <img src="/feather_w.svg" alt=""/>
              </WhiteLogo>
            </Flex>
          </Flex>

          <Flex flexDirection="column">
            <SubHeadingWrapper flexDirection="column" alignItems={["center", null, null, "end"]} >
              <GothamText scale="md" color="white" textTransform='uppercase'>
                {t('Built on Cronos Network')}
              </GothamText>
              { isMobile ? (
                <GothamText scale="lg" color="white" textAlign={["center", null, null, "right"]} textTransform='uppercase'>
                  {t('Trade, Stake, & Earn With Your DeFi Wallet')}
                </GothamText>
              ) : (
                <GothamText scale="lg" color="white" textAlign={["center", null, null, "right"]} textTransform='uppercase'>
                  {t('Trade, Stake, & Earn')}<br/>{t('With Your DeFi Wallet')}
                </GothamText>
              )}
              
            </SubHeadingWrapper>
            <Flex justifyContent="center" width="100%" mt="1em">
              <LaunchButton style={{backgroundColor:'white', color:'#004475'}}/>
            </Flex>
          </Flex>
          
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
