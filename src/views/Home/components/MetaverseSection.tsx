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
        <Flex order={[0, 0, 0, 1]} flex={[1, null, null, 5]}/>
        <TextSectionWrapper order={[1, null, 0]} flexDirection="column" flex={[1, null, null, 4]}justifyContent="center">
            <LandingHeading scale="xsl" textAlign="center" color="white">
              {t('CROW CLUB')}
            </LandingHeading>
            <FuturaText scale="md" textAlign="center" color="white"  mb="24px">
              {t('(Coming Soon)')}
            </FuturaText>
            <FuturaText scale="md" textAlign="center" color="white" mb="10px">
              {t('Step into the ever-expanding Metaverse with Crow Club! An interactive NFT-based MMO, where players can show off their bird-houses, fly around completing quests, or hang out with friends.')}
            </FuturaText>
            <FuturaText scale="md" textAlign="center" color="white">
              {t('Each Crow is a fully customizable NFT character that is owned by you! Collect, Play, Earn, Trade, & Have Fun')}
            </FuturaText>
        </TextSectionWrapper>
        
      </Flex>
    </>
  )
}

export default MetaverseSection
