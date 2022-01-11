import React, { HTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { Flex, FlexProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'
import LaunchButton from './LaunchButton'
import IconCard, { IconCardData } from './IconCard'


const TextSectionWrapper = styled(Flex)`
  padding: 0px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 40px;
  }
`

const MobileAppSection: React.FC<FlexProps> = ({ ...props }) => {
  const { t } = useTranslation()

  const cardData: IconCardData = {
  }

  return (
    <>
      <Flex justifyContent="center" {...props}>
        <TextSectionWrapper style={{height:'fit-content', width: 'fit-content'}} flexDirection="column" justifyContent="center" alignItems="center">
            <LandingHeading scale="xl" color="white" textAlign="center">
            {t('MOBILE APP')}
            </LandingHeading>
            <LandingHeading scale="md" color="white" mb="2em" textAlign="center">
            {t('LAUNCHING 2022')}
            </LandingHeading>
            <img src="/images/home/mobile_app.png" alt="" width="200px"/>
            <GothamText fontSize="md" color="white" textAlign="center" mb="10px">
            {t('For Easier Control Over Your Finances')}
            </GothamText>
            <GothamText fontSize="md" color="white" textAlign="center">
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
      </Flex>
    </>
  )
}

export default MobileAppSection;
