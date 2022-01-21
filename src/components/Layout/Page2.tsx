import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import Container from './Container'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 0;
  min-height: calc(100vh - 64px);
  background-image: url(/images/bg2.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.xs} {
    
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    min-height: calc(100vh - 64px);
  }
`
const StyledContainer = styled(Container)`
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export const PageMeta: React.FC<{ symbol?: string }> = ({ symbol }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const cakePriceUsd = useCakeBusdPrice()
  const cakePriceUsdDisplay = cakePriceUsd ? `$${cakePriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  // let pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
  let pageTitle = cakePriceUsdDisplay ? title : title
  if (symbol) {
    // pageTitle = [symbol, title].join(' - ')
    pageTitle = title
  }

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const Page2: React.FC<PageProps> = ({ children, symbol, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage>
      <StyledContainer {...props}>{children}</StyledContainer>
      </StyledPage>
      
    </>
  )
}

export default Page2
