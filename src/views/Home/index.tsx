import React from 'react'
import styled from 'styled-components'
import { PageMeta } from 'components/Layout/Page'
import Landing from './components/Landing'


const PageWrapper = styled.div`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
}
`

const Home: React.FC = () => {

  return (
    <>
      <PageMeta />
      <PageWrapper
      >
        <Landing />
      </PageWrapper>
    </>
  )
}

export default Home
