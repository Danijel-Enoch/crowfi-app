import React from 'react'
import { Flex, Radio, RadioProps, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const RadioGroup = styled(Flex)`
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

const StyledRadio = styled(Radio)`
  background: transparent;
  width: 20px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  ::after {
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
  }
  &:checked {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background: transparent;
    ::after {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
  &:focus:not(:disabled), &:hover:not(:disabled):not(:checked) {
      box-shadow: 0px 0px 0px 1px rgba(0, 68, 117, 0.1), 0px 0px 0px 4px rgba(0, 68, 117, 0.1);
  }
`


export interface RadioWithTextProps extends RadioProps{
    onClick: () => void
    text: string
    checked: boolean
}

const RadioWithText: React.FC<RadioWithTextProps> = ({ onClick, text, checked, ...props }) => {
  return (
    <RadioGroup onClick={onClick}>
        <StyledRadio onChange={() => null} {...props} checked={checked}/>
        <StyledText ml="8px">{text}</StyledText>
    </RadioGroup>
  )
}

export default RadioWithText



