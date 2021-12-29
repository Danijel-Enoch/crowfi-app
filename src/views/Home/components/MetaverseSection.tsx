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
            {t('CROW CLUB METAVERSE')}
          </LandingHeading>
          <FuturaText scale="md" textAlign="center" color="primary"  mb="24px">
            {t('(Comming Soon)')}
          </FuturaText>
          <FuturaText scale="lg" textAlign="center" color="primary">
            {t('Crow Finance, also known as CrowFi, provide a secure platform to trade with high leverage, low fees, low slippage and gas costs. STOP LOSS / LIMIT ORDER enables efficient trading at safe price range.')}
          </FuturaText>
        </TextSectionWrapper>
      </Flex>
    </>
  )
}

export default MetaverseSection
