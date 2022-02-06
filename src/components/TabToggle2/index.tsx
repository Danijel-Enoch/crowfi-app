import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  overflow-x: scroll;
  padding: 0;
  border-radius: 12px 12px 0 0;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`

const Inner = styled(Flex)`
  justify-content: space-between;
  background-color: ${({ theme }) => theme.card.background};
  width: 100%;
`

interface TabProps {
  isActive?: boolean
  onClick?: () => void
}

export const TabToggle2 = styled.button<TabProps>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  border: 0;
  outline: 0;
  padding: 16px;
  margin: 0;
  border-radius: 12px 12px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.text : theme.colors.textSubtle)};
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.input : theme.card.background)};
`

interface TabToggleGroupProps {
  children: React.ReactElement[]
}

export const TabToggleGroup2: React.FC<TabToggleGroupProps> = ({ children }) => {
  return (
    <Wrapper p={['0 4px', '0 16px']}>
      <Inner>{children}</Inner>
    </Wrapper>
  )
}
