import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GothamText, LandingHeading, FuturaText} from './LandingText'

const TextSectionWrapper = styled(Flex)`
  padding: 20px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }
`

const TradeSection = () => {
  const { t } = useTranslation()

  return (
    <>
        <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
        <Flex flex="1" flexDirection="column" justifyContent="center" alignItems="center">
            <img src="/images/home/rainbow2.svg" width="500px" alt=""/>
        </Flex>
        <TextSectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">
            <LandingHeading scale="lg" textAlign="center" color="primary">
            {t('Real Trading Tools for Real Traders')}
            </LandingHeading>
            <FuturaText scale="md" textAlign="center" color="primary"  mb="24px">
            {t('(Coming Soon)')}
            </FuturaText>
            <FuturaText scale="lg" textAlign="center" color="primary">
            {t('CrowFi provides a secure platform to trade with high leverage and low fees. Introducing Stop Losses and Limit Orders enables efficient trading at safe price ranges!')}
            </FuturaText>
        </TextSectionWrapper>
        </Flex>
    </>
  )
}

export default TradeSection
