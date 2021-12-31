import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useTVLStaked } from 'state/farms/hooks'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
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
  const tvlStakedCompactNumber = tvlStaked ? formatLocalisedCompactNumber(tvlStaked.toNumber()) : '-'

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallerScreen = isMobile || isTablet
  const split = tvlStakedCompactNumber.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
        <TextSectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">

          <LandingHeading scale="lg"  color="primary" textAlign="center">
            {t('TOTAL VALUE LOCKED')}
          </LandingHeading>
          {isSmallerScreen  ? (
            <GothamText scale="xl" color="primary" textAlign="center">${tvlStakedCompactNumber}</GothamText>
          ) : (
            <GothamText scale="xxl" color="primary" textAlign="center">
            {tvlStaked && tvlStaked.gt(0)
  ? `$${tvlStaked.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  : ''}
          </GothamText>
          )}
        </TextSectionWrapper>
      </Flex>
    </>
  )
}

export default TVLSection
