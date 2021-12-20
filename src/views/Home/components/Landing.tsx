import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Heading, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import useInterval from 'hooks/useInterval'
import moment from 'moment'

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
  const [countdown, setCountdown] = useState('')

  useInterval(() => {
    const target = 1640026800000;
    const now = new Date().getTime();
    const diffTime = target - now;
    if (diffTime > 0) {
      const duration = moment.duration(diffTime, 'milliseconds');
      const day = duration.days();
      const hour = day > 0 ? duration.hours() + day * 24 : duration.hours();
      const min = duration.minutes();
      const sec = duration.seconds();

      const hourS = hour < 10 ? `0${hour}`:`${hour}`;
      const minS = min < 10 ? `0${min}`:`${min}`;
      const secS = sec < 10 ? `0${sec}`:`${sec}`;
      setCountdown(`${hourS}:${minS}:${secS}`);
      
    } else {
      setCountdown('');
    }
  }, 1000)

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
            {
              countdown !== '' && (
                <>
                <Text textAlign="center" color="primary" fontSize="24px" mt="36px" >
                  {t('CrowFi is coming soon')}
                </Text>
                <Heading scale="xxl" color="secondary" mt="24px" textAlign="center">
                {countdown}
                </Heading>
                </>
              )
            }
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
    </>
  )
}

export default Landing
