import { Heading, Flex, Text, Input, Card } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledInput = styled(Input)`
    border-color: ${({ theme }) => theme.colors.secondary};
    font-size: 14px;
    
    color: ${({ theme }) => theme.colors.primary}

    ::placeholder {
        color: rgba(0, 68, 117, 0.5);
    }
    &:focus:not(:disabled) {
        box-shadow: 0px 0px 0px 1px rgba(0, 68, 117, 0.1), 0px 0px 0px 4px rgba(0, 68, 117, 0.1);
    }
`

export const StyledInputStyles = `
    border-color: ${({ theme }) => theme.colors.secondary};
    font-size: 14px;
    &:focus:not(:disabled) {
        box-shadow: 0px 0px 0px 1px rgba(0, 68, 117, 0.1), 0px 0px 0px 4px rgba(0, 68, 117, 0.1);
    }
`


export const StyledCard = styled(Card)`
  align-self: baseline;
  filter: ${({ theme }) => theme.card.dropShadow};
  min-width: min(280px, 100%);
`

export const StyledInputLabel = styled(Text)`
    color: ${({ theme }) => theme.colors.secondary};
    padding: 2px 8px;
    alpha: 0.8;
    font-size: 10px;
`