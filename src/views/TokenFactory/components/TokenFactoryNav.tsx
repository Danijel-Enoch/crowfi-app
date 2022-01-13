import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BoxButtonMenu from 'components/BoxButtonMenu'

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

  const menuItems = ['Create Token', 'Manage Tokens']
  const menuItemsOnMobile = ['Create', 'Manage']


  return (
    <NavWrapper>
      <BoxButtonMenu onItemClick={onMenuItemClick} items={menuItems} mobileItems={menuItemsOnMobile}/>
    </NavWrapper>
  )
}

export default TokenFactoryNav
