import React, { useCallback, useEffect, useState } from 'react'
import { Button, Flex, HamburgerCloseIcon, HamburgerIcon, IconButton, InputGroup, SearchIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { StyledInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
import ExpandableSectionButton from '../ExpandableSectionButton'

const Wrapper = styled(Flex)<{isOpen: boolean}>`
    transition: width .3s;
    max-width: 100%;
    width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    min-width: ${({ isOpen }) => isOpen ? '320px' : '0px'};
    overflow: hidden;
    border-right: 1px solid ${({ theme }) => theme.colors.cardBorder};
    background-color: white;

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 999;

    ${({ theme }) => theme.mediaQueries.sm} {
        position: unset;
        width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
        min-width: ${({ isOpen }) => isOpen ? '320px' : '50px'};
    }
`

interface AssetsFilterWrapperProps {
    isOpen: boolean
}

const AssetsFilterWrapper: React.FC<AssetsFilterWrapperProps> = ({isOpen, children}) => {

    return (
        <Wrapper flexDirection="column" isOpen={isOpen}>
            {children}
        </Wrapper>
    )
}

export default AssetsFilterWrapper