import React from 'react'
import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@pancakeswap/uikit'
import { ViewMode } from 'state/user/actions'

interface ToggleViewProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  margin-right: 0px;
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
    margin-right: 16px;
  }
`

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ viewMode, onToggle }) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }

  return (
    <Container>
      <IconButton variant="text" scale="sm" id="clickPoolCardView" onClick={() => handleToggle(ViewMode.CARD)}>
        <CardViewIcon color={viewMode === ViewMode.CARD ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'} />
      </IconButton>
      <IconButton variant="text" scale="sm" id="clickPoolTableView" onClick={() => handleToggle(ViewMode.TABLE)}>
        <ListViewIcon color={viewMode === ViewMode.TABLE ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'} />
      </IconButton>
    </Container>
  )
}

export default ToggleView
