import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LandingHeading, FuturaText} from './LandingText'


const TextSectionWrapper = styled(Flex)`
  padding: 20px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }
`

const MetaverseSection = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
        <Flex order={[0, 0, 0, 1]} flex="1" flexDirection="column" justifyContent="center" alignItems="center" paddingLeft={["20vw","20vw","20vw", "0"]} paddingRight={["20vw","20vw","20vw", "0"]}>
          <img src="/images/home/balloons2.svg" width="400px" alt=""/>
        </Flex>
        <TextSectionWrapper order={[1, null, 0]} flexDirection="column" style={{flex:1}} justifyContent="center">
          <LandingHeading scale="lg" textAlign="center" color="primary">
            {t('CROW CLUB')}
          </LandingHeading>
          <FuturaText scale="md" textAlign="center" color="primary"  mb="24px">
            {t('(Comming Soon)')}
          </FuturaText>
          <FuturaText scale="lg" textAlign="center" color="primary" mb="10px">
            {t('Step into the ever-expanding Metaverse with Crow Club! An interactive NFT-based MMO, where players can show off their bird-houses, fly around completing quests, or hang out with friends.')}
          </FuturaText>
          <FuturaText scale="lg" textAlign="center" color="primary">
            {t('Each Crow is a fully customizable NFT character that is owned by you! Collect, Play, Earn, Trade, & Have Fun')}
          </FuturaText>
        </TextSectionWrapper>
      </Flex>
    </>
  )
}

export default MetaverseSection
