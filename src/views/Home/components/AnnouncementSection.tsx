import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LandingHeading, FuturaText} from './LandingText'


const TextSectionWrapper = styled(Flex)`
  padding: 40px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const MediumLink = styled.a`
  margin-top: 1em;
  text-align:center;
  color: ${({ theme }) => theme.colors.primary};
`

const AnnouncementSection = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex flexDirection="column">
        <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
            <Flex order={[0, 0, 0, 1]} flex="1" flexDirection="column" justifyContent="center" alignItems="center">
                <img src="/images/home/rainbow2.svg" width="500px" alt=""/>
            </Flex>
            <TextSectionWrapper order={[1, null, 0]} flexDirection="column" style={{flex:1}} justifyContent="center">
                <LandingHeading scale="lg" mb="24px" textAlign="center" color="primary">
                {t('ANNOUNCEMENTS')}
                </LandingHeading>
                <LandingHeading scale="md" mb="24px" textAlign="center" color="primary">
                {t('CrowFi Creator Contest')}
                </LandingHeading>
                <FuturaText scale="lg" textAlign="center" color="primary">
                {t('Crows, we are taking our first step towards enabling financial literacy across the Decentralized Financial space, and YOU are the ideal teachers!\nCome use your creativity and talent to produce high-quality videos aimed at educating new members of the community!')}
                </FuturaText>
                <MediumLink href="https://crowfiapp.medium.com/" target="_blank">
                    {t('View More')}
                </MediumLink>
            </TextSectionWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default AnnouncementSection
