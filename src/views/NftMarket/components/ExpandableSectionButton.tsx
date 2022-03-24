import React from 'react'
import styled, { css } from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
  title?: string
}

const Wrapper = styled.div<{expanded?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${(props) =>
    props.expanded &&
    css`
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
    `}

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded, title }) => {
  const { t } = useTranslation()

  return (
    <Wrapper role="button" onClick={() => onClick()} expanded={expanded}>
      <Text color="primary" bold>
        {title}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

ExpandableSectionButton.defaultProps = {
  expanded: false,
}

export default ExpandableSectionButton
