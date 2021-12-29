import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTVLStaked } from 'state/farms/hooks'
import { GothamText, LandingHeading} from './LandingText'


const TextSectionWrapper = styled(Flex)`
  padding: 40px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const TVLSection = () => {
  const { t } = useTranslation()
  const tvlStaked = useTVLStaked()

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
        <TextSectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">

          <LandingHeading scale="lg"  color="primary" textAlign="center">
            {t('TOTAL VALUE LOCKED')}
          </LandingHeading>
          <GothamText scale="xxl" color="primary" textAlign="center">
            {tvlStaked && tvlStaked.gt(0)
  ? `$${tvlStaked.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  : ''}
          </GothamText>
        </TextSectionWrapper>
      </Flex>
    </>
  )
}

export default TVLSection
