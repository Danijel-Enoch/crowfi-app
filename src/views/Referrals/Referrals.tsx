import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
import ReferralLink from './components/ReferralLink'
import TotalReferralCount from './components/TotalReferralCount'
import ReferralQRCode from './components/ReferralQRCode'

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

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${rotCombiAnim(30, 60, 90, 50, 1)} 7s linear infinite;

  ${({ theme }) => theme.mediaQueries.md} {
    animation: ${rotCombiAnim(50, 100, 150, 70, 0.5)} 7s linear infinite;
  }
`

const WrappedFlex = styled(Flex)`
    position:absolute;
    ${({ theme }) => theme.mediaQueries.md} {
        position:relative;  
    }
`

const Referrals: React.FC = () => {
    const { t } = useTranslation()
    const { account } = useWeb3React()
  
    return (
        <>
            <Page>
                <Flex
                    position="relative"
                    flexDirection={['column-reverse', null, null, 'row']}
                    alignItems={['center', null, null, 'center']}
                    justifyContent="center"
                >
                    <Flex flex="1" flexDirection="column">
                        <Heading scale="xl" color="primary" mb="24px">
                            {t('CrowFi Referral Program')}
                        </Heading>
                        <Text textAlign="start" color="primary" fontSize="18px" mb="12px" >
                           1. Share this QR Code or link with your friends.
                        </Text>
                        <Text textAlign="start" color="primary" fontSize="18px" mb="12px" >
                           2. Make sure they open in a web3 compatible browser (MetaMask, Token Pocket)
                        </Text>
                        <Text textAlign="start" color="primary" fontSize="18px" mb="12px" >
                           3. Earn a 5% referral bonus when they harvest their farm earnings
                        </Text>
                        <Flex flexDirection="column">
                            {account ? (
                                <>
                                <TotalReferralCount />
                                <ReferralLink account={account} /> 
                                <Flex justifyContent="center">
                                    <ReferralQRCode account={account} /> 
                                </Flex>
                                </>
                            ) : (
                                <>
                                <ConnectWalletButton mr="8px" />
                                </>
                            )}
                        </Flex>
                    </Flex>
                    <WrappedFlex
                    height={['128px', null, null, '100%']}
                    width={['128px', null, null, '100%']}
                    flex={[null, null, null, '1']}
                    mb={['24px', null, null, '0']}
                    position="relative"
                    >
                    <BunnyWrapper>
                        <img src='/logo.png' alt={t('Crow Logo')} />
                    </BunnyWrapper>
                    </WrappedFlex>
                </Flex>
            </Page>
        </>
    )
}

export default Referrals