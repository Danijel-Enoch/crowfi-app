
import styled from 'styled-components'
import { Button, Flex } from '@pancakeswap/uikit'

export const Wrapper = styled(Flex)<{isOpen: boolean, topOffset: number, heightOffset: number}>`
    transition: top .3s;
    max-width: 100%;
    width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    min-width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    overflow: hidden;
    overflow-y: scroll;
    border-right: 1px solid ${({ theme }) => theme.colors.cardBorder};
    background-color: white;
    padding-bottom: 20px;

    position: fixed;
    top: ${({ topOffset }) => `${topOffset}px`};
    left: 0;
    height: ${({ heightOffset }) => `calc(100vh - ${heightOffset}px)`};
    z-index: 999;
    transform: translate3d(0, 0, 0);

    ${({ theme }) => theme.mediaQueries.sm} {
        width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
        min-width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
    }
`

export const Container = styled.div<{isOpen: boolean}>`
    display: flex;
    flex-direction: column;
    width: 320px;
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
`

export const ExpandingWrapper = styled.div`
    display:flex;
    flex-direction: column;
    overflow: hidden;
`

export const OptionButton = styled(Button)`
    flex: 1;
    font-size: 14px;
`