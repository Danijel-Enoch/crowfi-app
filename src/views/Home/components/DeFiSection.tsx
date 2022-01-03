import React, { useState } from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { CrowLogoIcon, EarnIcon, Flex, LogoIcon, SwapIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LandingHeading, FuturaText} from './LandingText'
import IconCard, { IconCardData } from './IconCard'

const DeFiSection = () => {
    const { t } = useTranslation()
    const { theme } = useTheme()

    const tradeCardData: IconCardData = {
        icon: <SwapIcon color="secondary" width="36px" />,
    }

    const poolCardData: IconCardData = {
        icon: <EarnIcon color="secondary" width="36px" />,
    }

    const stakeCardData: IconCardData = {
        icon: <CrowLogoIcon fill={theme.colors.secondary} width="36px" />,
    }
  
    return (
      <>
        <Flex justifyContent="center" alignItems="center" flexDirection="column">
            <LandingHeading scale="xsl" mb="24px" textAlign="center" color="#fff">
                {t('DeFi Made Simple')}
            </LandingHeading>

            <Flex flexDirection={['column', null, null, 'row']}>
                <IconCard {...tradeCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']} style={{flex: 1}} background='rgba(255, 255, 255, 0.7)'>
                    <Flex
                    minWidth="232px"
                    flexDirection="column"
                    justifyContent="flex-start"
                    mt={[null, null, null, '64px']}
                    >
                        <LandingHeading scale="sm" mb="24px" textAlign={["left", null, null, "center"]} color={theme.colors.primary}>
                        {t('Trade Token With Ease')}
                        </LandingHeading>
                        <FuturaText scale="md" textAlign="justify" color={theme.colors.primary}>
                        {t('Swap DeFi tokens on the Cronos network with the lowest fees!')}
                        </FuturaText>
                    </Flex>
                </IconCard>
                <IconCard {...poolCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']} style={{flex: 1}} background='rgba(255, 255, 255, 0.7)'>
                    <Flex
                    minWidth="232px"
                    width="fit-content"
                    flexDirection="column"
                    justifyContent="flex-start"
                    mt={[null, null, null, '64px']}
                    >
                        <LandingHeading scale="sm" mb="24px" textAlign={["left", null, null, "center"]} color={theme.colors.primary}>
                        {t('Become a Liquidity Provider')}
                        </LandingHeading>
                        <FuturaText scale="md" textAlign="justify" color={theme.colors.primary}>
                        {t('Supply liquidity to a pair to receive LP Tokens and earn Crow from trading fees!')}
                        </FuturaText>
                    </Flex>
                </IconCard>
                <IconCard {...stakeCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']} style={{flex: 1}} background='rgba(255, 255, 255, 0.7)'>
                    <Flex
                    minWidth="232px"
                    width="fit-content"
                    flexDirection="column"
                    justifyContent="flex-start"
                    mt={[null, null, null, '64px']}
                    >
                        <LandingHeading scale="sm" mb="24px" textAlign={["left", null, null, "center"]} color={theme.colors.primary}>
                        {t('Put Your Crows To Work')}
                        </LandingHeading>
                        <FuturaText scale="md" textAlign="justify" color={theme.colors.primary}>
                        {t('Simply stake your Crow tokens to earn passive income')}
                        </FuturaText>
                    </Flex>
                </IconCard>
            </Flex>
        </Flex>
      </>
    )
}

export default DeFiSection