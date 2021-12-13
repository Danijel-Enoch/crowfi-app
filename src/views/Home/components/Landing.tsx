import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Heading, Text, Image, Button } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import useTheme from 'hooks/useTheme'

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`

const LogoWrapper = styled.div`
  flex: none;
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    margin-left: 8px;
  }
`


const TextSectionWrapper = styled(Flex)`
  padding: 40px 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`
const ImageWrapper = styled.div`
  background: #fff;
  border-radius: 30px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ImageWrapper2 = styled.div`
  background: #fff;
  border-radius: 30px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  order: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const PaddingWrapper = styled.div`
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  justify-self: stretch;
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  align-self: stretch;
`

const Landing = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      <Flex flexDirection="column">
        <Flex>
          <LogoWrapper>
            <img src="/images/logo_left.png" alt=""/>
          </LogoWrapper>
          <PaddingWrapper/>
          <TextSectionWrapper flexDirection="column" justifyContent="center" alignItems="center">
            <Heading scale="xxl" color="primary" mb="24px" textAlign="center">
              {t('We are Crow Finance')}
            </Heading>
            <Text textAlign="center" color="primary" fontSize="24px" mb="36px" >
              {t('Built on the Cronos Network. Stake & Swap from your wallet')}
            </Text>
            <Link to="/swap">
              <Button >{t('Launch App')}</Button>
            </Link>
          </TextSectionWrapper>
          <PaddingWrapper/>
          <LogoWrapper>
            <img src="/images/logo_right.png" alt=""/>
          </LogoWrapper>
        </Flex>

        <Container>
          <Flex flexDirection="column">
            <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
              <ImageWrapper style={{flex:1}}>
                <img src="/images/img_hello.png" alt=""/>
              </ImageWrapper>
              <TextSectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">
                <Heading scale="xl" color="secondary" mb="24px" textAlign="center">
                  {t('Our Vision')}
                </Heading>
                <Text fontSize="24px" textAlign="center">
                  {t('Crow Finance, also known as CrowFi, provide a secure platform to reclaim control of your finances. You will get to manage and earn on your assets without the need for banks and other middlemen, creating a truly community-owned financial system.')}
                </Text>
              </TextSectionWrapper>
            </Flex>
            <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-around">
              <ImageWrapper2 style={{flex:1}}>
                <img src="/images/img_flying.png" alt=""/>
              </ImageWrapper2>
              <TextSectionWrapper flexDirection="column" style={{flex:1}} justifyContent="center">
                <Heading scale="xl" color="secondary" mb="24px" textAlign="center">
                  {t('Decentralized & Efficient')}
                </Heading>
                <Text fontSize="24px" textAlign="center">
                  {t('Crow is a decentralized currency that does not discriminate. Any individual or business can realize the advantages of finance.')}
                </Text>
              </TextSectionWrapper>
            </Flex>
          </Flex>

        </Container>


        <Flex>
          <LogoWrapper>
            <img src="/images/img_ballon_left.png" alt=""/>
          </LogoWrapper>
          <PaddingWrapper/>
          <TextSectionWrapper flexDirection="column" justifyContent="center" alignItems="center">
            <Heading scale="xxl" color="primary" mb="24px" textAlign="center">
              {t('Mobile App launching soon!')}
            </Heading>
            <Text textAlign="center" color="primary" fontSize="24px" mb="36px">
              {t('For easier access to your crow finance wallet')}
            </Text>
            <Link to="/swap">
              <Button >{t('Launch App')}</Button>
            </Link>
          </TextSectionWrapper>
          <PaddingWrapper/>
          <LogoWrapper>
            <img src="/images/img_ballon_right.png" alt=""/>
          </LogoWrapper>
        </Flex>

      </Flex>
      {/* <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        mt={[account ? '280px' : '50px', null, 0]}
        id="homepage-hero"
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
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <BunnyWrapper>
            <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Lunar bunny')} />
          </BunnyWrapper>
          <StarsWrapper>
          </StarsWrapper>
        </Flex>
      </Flex> */}
    </>
  )
}

export default Landing
