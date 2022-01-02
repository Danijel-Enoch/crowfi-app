import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'
import LaunchButton from './LaunchButton'


const WhiteLogo = styled(Flex)`
  justify-content:center;
  align-items:center;
  width: 70px;
  height: 70px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius:35px;
  padding: 18px;


  ${({ theme }) => theme.mediaQueries.md} {
    width: 140px;
    height: 140px;
    border-radius:70px;
    padding: 36px;
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
    background: white;
    padding: 10px 30px 10px 60px;
  }
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flex="1" flexDirection="column" justifyContent="center" alignItems="center">
          <img width="600px" src="/images/home/hot-air-balloon.svg" alt=""/>
        </Flex>
        <Flex flexDirection="column" alignItems={["center", "cener", "center", "end"]}>
          <Flex flexDirection="column" pr={['0', null, '4em']}>
            <Flex alignItems="center" justifyContent={["center", "cener", "center", null]}>
              <LandingHeading scale="md" color="primary">
                {t('WE ARE')}
              </LandingHeading>
              <Line />
            </Flex>
            
            <Flex flexDirection="row" alignItems="center">
              <Flex flexDirection="column" alignItems="end">
                <LandingHeading scale="xl" color="primary">
                  {t('CROW')}
                </LandingHeading>
                <LandingHeading scale="lg" color="primary">
                  {t('FINANACE')}
                </LandingHeading>
              </Flex>
              <WhiteLogo>
                <img src="/feather_w.svg" alt=""/>
              </WhiteLogo>
            </Flex>
          </Flex>

          <Flex flexDirection="column">
            <SubHeadingWrapper flexDirection="column" alignItems="center" >
              <GothamText scale="md" color="primary" textTransform='uppercase'>
                {t('Built on Cronos Network')}
              </GothamText>
              <GothamText scale="lg" color="primary" textAlign="center" textTransform='uppercase'>
                {t('Trade, Stake, & Earn With Your DeFi Wallet')}
              </GothamText>
            </SubHeadingWrapper>
            <Flex justifyContent="center" width="100%" mt="1em">
              <LaunchButton />
            </Flex>
          </Flex>
          
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
