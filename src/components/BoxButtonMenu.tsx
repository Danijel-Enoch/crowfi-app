import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Button, ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const NavWrapper = styled(Flex)`
  justify-content: center;
  padding: 20px 16px;
  flex-direction: row;
  max-width: 100%;
  overflow-x: scroll;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
  }
`

interface StatusProps {
  active: boolean
}

const StyledButton = styled(Button)<StatusProps>`
  background-color: transparent;
  box-shadow: unset;

  padding: 0px 12px;

  color: ${({ theme }) => theme.colors.primary};

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0px 24px;
  }

  ${({ active, theme }) => {
    if (active) {
      return `
        background-color: ${theme.colors.backgroundAlt};

        &:hover:not(:disabled):not(:active) {
          background-color: ${theme.colors.backgroundAlt};
        }
    `;
    }
    return "";
  }}
`

export interface BoxButtonMenuProps {
    activeIndex?: number
    items: string[],
    mobileItems?: string[]
    onItemClick?: (index: number) => void
}

const BoxButtonMenu: React.FC<BoxButtonMenuProps> = ({activeIndex = 0, onItemClick, items, mobileItems}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [activeButtonIndex, setActiveButtonIndex] = useState(activeIndex)

  const onMenuItemClick = (index: number) => {
    setActiveButtonIndex(index)
    if (onItemClick) {
        onItemClick(index)
    }
  }


  return (
    <NavWrapper>
      <Box>
        <Flex alignItems="center">
          {
            items.map((item, index) => (
              <StyledButton key={item} onClick={() => onMenuItemClick(index)} active={index === activeButtonIndex}>
                {isMobile && mobileItems ? mobileItems[index] : item}
              </StyledButton>
            ))
          }
        </Flex>
        {/* <ButtonMenu activeIndex={activeButtonIndex} scale="sm" variant="subtle" onItemClick={onMenuItemClick}>
          {
            items.map((item, index) => (
              <ButtonMenuItem as="button" key={item}>
                {isMobile && mobileItems ? mobileItems[index] : item}
              </ButtonMenuItem>
            ))
          }
        </ButtonMenu> */}
      </Box>
    </NavWrapper>
  )
}

export default BoxButtonMenu
