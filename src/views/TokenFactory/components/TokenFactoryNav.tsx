import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const NavWrapper = styled(Flex)`
  justify-content: center;
  padding: 20px 16px;
  flex-direction: row;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
  }
`

export interface TokenFactoryNavProps {
    activeIndex?: number
    onItemClick?: (index: number) => void
}

const TokenFactoryNav: React.FC<TokenFactoryNavProps> = ({activeIndex = 0, onItemClick}) => {
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
        <ButtonMenu activeIndex={activeButtonIndex} scale="sm" variant="subtle" onItemClick={onMenuItemClick}>
          <ButtonMenuItem as="button">
            {isMobile ? t('Create') : t('Create Token')}
          </ButtonMenuItem>
          <ButtonMenuItem as="button">
            {isMobile ? t('Manage') : t('Manage Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Box>
    </NavWrapper>
  )
}

export default TokenFactoryNav
