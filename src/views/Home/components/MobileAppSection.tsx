import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'
import LaunchButton from './LaunchButton'


const TextSectionWrapper = styled(Flex)`
  padding: 40px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const MobileAppSection = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex justifyContent="center" >
        <TextSectionWrapper flexDirection="column" justifyContent="center" alignItems="center">
            <LandingHeading scale="xl" color="primary" textAlign="center">
            {t('MOBILE APP')}
            </LandingHeading>
            <LandingHeading scale="md" color="primary" mb="2em" textAlign="center">
            {t('LAUNCHING SOON')}
            </LandingHeading>
            <GothamText fontSize="md" color="primary" textAlign="center">
            {t('FOR EASIER ACCESS TO YOUR CROW')}
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
