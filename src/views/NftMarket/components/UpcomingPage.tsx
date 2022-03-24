import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Heading, LogoIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div`
    position:relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 540px);

    ${({ theme }) => theme.mediaQueries.sm} {
        padding-top: 32px;
        min-height: calc(100vh - 380px);
    }

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 32px;
        min-height: calc(100vh - 336px);
    }
`

const UpcomingPage: React.FC = () => {
    const { t } = useTranslation()
  
    return (
        <Wrapper>

            <LogoIcon width="64px" mb="8px" />
            <Heading scale="xxl">Upcoming Feature</Heading>
            <Text mb="16px">{t('This feature is in the development')}</Text>
            <Button as={Link} to="/" scale="sm">
            {t('Back Home')}
            </Button>
        </Wrapper>
    )
  }
  
  export default UpcomingPage