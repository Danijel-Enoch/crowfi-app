import React from 'react'
import { Spinner, Flex } from '@pancakeswap/uikit'
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

const SpinnerWrapper = styled(Flex)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const FullWidthFlex = styled(Flex)`
    width: 100%;
`

const LoadingPage: React.FC = () => {
    const { t } = useTranslation()
  
    return (
        <Wrapper>
            <SpinnerWrapper >
                <FullWidthFlex justifyContent="center" alignItems="center">
                    <Spinner />
                </FullWidthFlex>
            </SpinnerWrapper>
        </Wrapper>
    )
  }
  
  export default LoadingPage