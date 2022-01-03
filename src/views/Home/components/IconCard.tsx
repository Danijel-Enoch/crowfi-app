import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Box, CardProps } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{ background: string; rotation?: string, width?: string }>`
  padding: 1px 1px 4px 1px;
  box-sizing: border-box;
  width: ${({ width }) => (width ? `${width}` : 'auto')}

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

const IconWrapper = styled(Box)<{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

interface IconCardProps extends IconCardData, CardProps {
  children: ReactNode
}

export interface IconCardData {
  icon?: ReactNode
  background?: string
  borderColor?: string
  rotation?: string
  width?: string
}

const IconCard: React.FC<IconCardProps> = ({ width = 'auto', icon, background, borderColor, rotation, children, ...props }) => {
  return (
    <StyledCard background={background} borderBackground={borderColor} rotation={rotation} {...props} width={width}>
      <CardBody style={{width}}>
        { icon && (
          <IconWrapper rotation={rotation}>{icon}</IconWrapper>
        )}
        {children}
      </CardBody>
    </StyledCard>
  )
}

export default IconCard
