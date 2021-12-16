import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
import useTheme from 'hooks/useTheme'
import { SlideSvgDark, SlideSvgLight } from './components/SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from './components/CompositeImage'
import ReferralLink from './components/ReferralLink'
import TotalReferralCount from './components/TotalReferralCount'

const rotCombiAnim = (x1, x2, x3, y, scale) => keyframes`
    0% {
        transform: scaleX(2) rotate(0deg) translateX(${x2}px) translateY(${y}px) scale(0.3) rotate(0deg) rotateY(180deg) rotateZ(-20deg) scaleX(${scale});
        opacity: 0.5;
    }
    10% {
        transform: scaleX(2) rotate(50deg) translateX(${x2}px) translateY(${y}px) scale(0.3) rotate(-50deg) rotateY(30deg) rotateZ(-20deg) scaleX(${scale});
    }
    20% {
        transform: scaleX(2) rotate(72deg) translateX(${x2}px) translateY(${y}px) scale(0.3) rotate(-72deg) rotateY(0deg) rotateZ(0deg) scaleX(${scale});
        opacity: 0.5;
    }
    30% {
        transform: scaleX(2) rotate(90deg) translateX(${x3}px) translateY(${y}px) scale(0.3) rotate(-90deg) rotateX(90deg) rotateY(0deg) rotateZ(50deg) scaleX(${scale});
    }
    40% {
        transform: scaleX(2) rotate(144deg) translateX(${x1}px) translateY(${y}px) scale(0.3) rotate(-144deg) rotateX(180deg) rotateY(0deg) rotateZ(50deg) scaleX(${scale});
        opacity: 0.5;
    }
    50% {
        transform: scaleX(2) rotate(180deg) translateX(${x1}px) translateY(${y}px) scale(0.3) rotate(-180deg) rotateX(90deg) rotateY(0deg) rotateZ(50deg) scaleX(${scale});
        opacity: 0.5;
    }
    60% {
        transform: scaleX(2) rotate(216deg) translateX(${x1}px) translateY(${y}px) scale(0.3) rotate(-216deg) rotateX(0deg) rotateY(0deg) rotateZ(40deg) scaleX(${scale});
        opacity: 0.5;
    }
    70% {
        transform: scaleX(2) rotate(252deg) translateX(${x1}px) translateY(${y}px) scale(0.3) rotate(-252deg) rotateX(90deg) rotateY(0deg) rotateZ(40deg) scaleX(${scale});
        opacity: 0.5;
    }
    80% {
        transform: scaleX(2) rotate(270deg) translateX(${x1}px) translateY(${y}px) scale(0.3) rotate(-270deg) rotateX(0deg) rotateY(0deg) scaleX(${scale});
        opacity: 0.5;
    }
    95% {
        transform: scaleX(2) rotate(324deg) translateX(${x1}px)  translateY(${y}px) scale(0.3) rotate(-324deg) rotateY(180deg) rotateZ(-20deg) scaleX(${scale});
        opacity: 0.5;
    }
    100% {
        transform: scaleX(2) rotate(360deg) translateX(${x2}px) translateY(${y}px) scale(0.3) rotate(-360deg) rotateY(540deg) rotateZ(-20deg) scaleX(${scale});
        opacity: 0.5;
    }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${rotCombiAnim(30, 60, 90, 50, 1)} 7s linear infinite;

  ${({ theme }) => theme.mediaQueries.md} {
    animation: ${rotCombiAnim(50, 100, 150, 70, 0.5)} 7s linear infinite;
  }
`

const Referrals: React.FC = () => {
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const { theme } = useTheme()
  
    return (
        <>
            <Page>
                <BgWrapper>
                    <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
                </BgWrapper>
                <Flex
                    position="relative"
                    flexDirection={['column-reverse', null, null, 'row']}
                    alignItems={['center', null, null, 'center']}
                    justifyContent="center"
                >
                    <Flex flex="1" flexDirection="column">
                    <Heading scale="xxl" color="secondary" mb="24px">
                        {t('CrowFi Referral Program')}
                    </Heading>
                    <Heading scale="md" mb="24px">
                        {t('Share the referral link below to invite your friends and earn 5% of your friends earnings FOREVER!')}
                    </Heading>
                    <Flex>
                        {account ? (
                            <div>
                            <ReferralLink /> 
                            <TotalReferralCount />
                            </div>
                        ) : (
                            <div>
                            <ConnectWalletButton mr="8px" />
                            </div>
                        )}
                    </Flex>
                    </Flex>
                    <Flex
                    height={['128px', null, null, '100%']}
                    width={['128px', null, null, '100%']}
                    flex={[null, null, null, '1']}
                    mb={['24px', null, null, '0']}
                    position="relative"
                    >
                    <BunnyWrapper>
                        <img src='/logo.png' alt={t('Crow Logo')} />
                    </BunnyWrapper>
                    </Flex>
                </Flex>
            </Page>
        </>
    )
}

export default Referrals