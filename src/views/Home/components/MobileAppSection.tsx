import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'
import LaunchButton from './LaunchButton'
import IconCard, { IconCardData } from './IconCard'


const TextSectionWrapper = styled(Flex)`
  padding: 40px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const MobileAppSection = () => {
  const { t } = useTranslation()

  const cardData: IconCardData = {
  }

  return (
    <>
      <Flex justifyContent="center" >
      <IconCard {...cardData} mr={[null, null, null, '16px']} mt="32px" width="fit-content" background='rgba(255, 255, 255, 0.7)'>
        <TextSectionWrapper style={{height:'fit-content', width: 'fit-content'}} flexDirection="column" justifyContent="center" alignItems="center">
            <LandingHeading scale="xl" color="primary" textAlign="center">
            {t('MOBILE APP')}
            </LandingHeading>
            <LandingHeading scale="md" color="primary" mb="2em" textAlign="center">
            {t('LAUNCHING 2022')}
            </LandingHeading>
            <GothamText fontSize="md" color="primary" textAlign="center" mb="10px">
            {t('For Easier Control Over Your Finances')}
            </GothamText>
            <GothamText fontSize="md" color="primary" textAlign="center">
            {t('Trade - Farm - Stake - Earn')}
            </GothamText>
            <Flex alignItems="center">
            <img src="/images/home/wallet.svg" width="50px" alt=""/>
            <LandingHeading scale="md" color="primary" textAlign="center">
                {t('CROWFI WALLET')}
            </LandingHeading>
            </Flex>
            <LaunchButton />
        </TextSectionWrapper>
        </IconCard>
        </Flex>
    </>
  )
}

export default MobileAppSection;
