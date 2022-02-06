import React from 'react'
import { Flex, CheckboxProps, Checkbox, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const CheckboxGroup = styled(Flex)`
  align-items: center;
  padding: 4px 0px;
  cursor: pointer;
  &:hover {
    > div {
      opacity: 0.8;
    }
  }
`

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`

const StyledCheckbox = styled(Checkbox)`
  background: transparent;
  width: 20px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  ::after {
  }
  &:checked {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: transparent;
    ::after {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  &:focus:not(:disabled), &:hover:not(:disabled):not(:checked) {
      box-shadow: 0px 0px 0px 1px rgba(0, 68, 117, 0.1), 0px 0px 0px 4px rgba(0, 68, 117, 0.1);
  }
`


export interface CheckboxWithTextProps extends CheckboxProps{
    onClick: () => void
    text: string
    checked: boolean
}

const RadioWithText: React.FC<CheckboxWithTextProps> = ({ onClick, text, checked, ...props }) => {
  return (
    <CheckboxGroup onClick={onClick}>
        <StyledCheckbox onChange={() => null} {...props} checked={checked}/>
        <StyledText ml="8px">{text}</StyledText>
    </CheckboxGroup>
  )
}

export default RadioWithText



