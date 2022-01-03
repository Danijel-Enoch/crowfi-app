import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LandingHeading, FuturaText} from './LandingText'
import IconCard, { IconCardData } from './IconCard'


const TextSectionWrapper = styled(Flex)`
  padding: 20px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }
`

const MetaverseSection = () => {
  const { t } = useTranslation()

  const tradeCardData: IconCardData = {
  }

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
        <Flex order={[0, 0, 0, 1]} flex="1" flexDirection="column" justifyContent="center" alignItems="center" paddingLeft={["20vw","20vw","20vw", "0"]} paddingRight={["20vw","20vw","20vw", "0"]}>
          <img src="/images/home/balloons2.svg" width="400px" alt=""/>
        </Flex>
        <IconCard {...tradeCardData} mr={[null, null, null, '16px']} mt={['32px', null, null, '0']} style={{flex: 1, height:'fit-content'}} background='rgba(255, 255, 255, 0.7)'>
          <TextSectionWrapper order={[1, null, 0]} flexDirection="column" style={{flex:1}} justifyContent="center">
            <LandingHeading scale="xsl" textAlign="center" color="primary">
              {t('CROW CLUB')}
            </LandingHeading>
            <FuturaText scale="md" textAlign="center" color="primary"  mb="24px">
              {t('(Coming Soon)')}
            </FuturaText>
            <FuturaText scale="md" textAlign="justify" color="primary" mb="10px">
              {t('Step into the ever-expanding Metaverse with Crow Club! An interactive NFT-based MMO, where players can show off their bird-houses, fly around completing quests, or hang out with friends.')}
            </FuturaText>
            <FuturaText scale="md" textAlign="justify" color="primary">
              {t('Each Crow is a fully customizable NFT character that is owned by you! Collect, Play, Earn, Trade, & Have Fun')}
            </FuturaText>
          </TextSectionWrapper>
        </IconCard>
        
      </Flex>
    </>
  )
}

export default MetaverseSection
