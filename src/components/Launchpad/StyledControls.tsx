import React, { useMemo } from 'react'
import { Heading, Flex, Text, Input, Card } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { escapeRegExp } from 'utils'
import useENS from 'hooks/ENS/useENS'
import { Link } from 'react-router-dom'

export const LinkWrapper = styled(Link)`
text-decoration: none;
:hover {
  cursor: pointer;
  opacity: 0.7;
}`

export const PageBGWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: url(/images/bg2.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
`

export const StyledText = styled.textarea<{hasError?: boolean}>`
  border-color: ${({ hasError, theme }) => (hasError ? theme.colors.failure : theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.primary}
  width: 100%;
  min-height: 10em;
  resize: none;
  padding: 8px;
  border-radius: 12px;
  ::placeholder {
    color: rgba(0, 68, 117, 0.5);
  }
  &:focus:not(:disabled) {
      box-shadow: 0px 0px 0px 1px rgba(0, 68, 117, 0.1), 0px 0px 0px 4px rgba(0, 68, 117, 0.1);
      outline: unset;
  }
`

export const StyledInput = styled(Input)<{hasError?: boolean}>`
    border-color: ${({ hasError, theme }) => (hasError ? theme.colors.failure : theme.colors.secondary)};
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

export const StyledTextarea = React.memo(function InnerTextArea({
  value,
  placeholder,
  onUserInput,
  hasError,
  ...rest
}: {
  hasError?: boolean
  value: string
  onUserInput: (input: string) => void

} & Omit<React.HTMLProps<HTMLTextAreaElement>, 'ref' | 'onChange' | 'as'>) {

  const enforcer = (nextUserInput: string) => {
    onUserInput(nextUserInput)
  }

  return (
    <StyledText
      {...rest}
      hasError={hasError}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value)
        // enforcer(event.target.value)
      }}
      // universal input options
      placeholder={placeholder}
      inputMode="text"
      spellCheck="false"
    />
  )
})

export const StyledTextInput = React.memo(function InnerInput({
    value,
    onUserInput,
    title,
    placeholder,
    pattern,
    validateReg,
    transform,
    ...rest
  }: {
    value: string | number
    onUserInput: (input: string) => void
    title?: string
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
    pattern?: string,
    validateReg?:RegExp
    transform?: (input: string) => string
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
    // const pattern_ = pattern || "^[\\d\\w].*[\\d\\w]*$"
    // const validateReg_ = validateReg || RegExp(`^[\\d\\w].*[\\d\\w]*$`)
    const enforcer = (nextUserInput: string) => {
      const text = transform ? transform(nextUserInput) : nextUserInput
      if (text === '' || !validateReg || validateReg.test(escapeRegExp(text))) {
        onUserInput(text)
      }
      // if (nextUserInput === '' || validateReg_.test(escapeRegExp(nextUserInput))) {
      //   onUserInput(nextUserInput)
      // }
    }
  
    const { t } = useTranslation()
  
    return (
      <StyledInput
        {...rest}
        value={value}
        onChange={(event) => {
          enforcer(event.target.value)
          // enforcer(event.target.value)
        }}
        // universal input options
        inputMode="text"
        title={title}
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern={pattern}
        placeholder={placeholder}
        spellCheck="false"
      />
    )
  })


export const StyledAddressInput = React.memo(function InnerInput({
  value,
  onUserInput,
  title,
  placeholder,
  pattern,
  validateReg,
  transform,
  ...rest
}: {
  value: string
  onUserInput: (input: string) => void
  title?: string
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  pattern?: string,
  validateReg?:RegExp
  transform?: (input: string) => string
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  // const pattern_ = pattern || "^[\\d\\w].*[\\d\\w]*$"
  // const validateReg_ = validateReg || RegExp(`^[\\d\\w].*[\\d\\w]*$`)
  const enforcer = (nextUserInput: string) => {
    const text = transform ? transform(nextUserInput) : nextUserInput
    if (text === '' || !validateReg || validateReg.test(escapeRegExp(text))) {
      const withoutSpaces = text.replace(/\s+/g, '')
      onUserInput(withoutSpaces)
    }
    // if (nextUserInput === '' || validateReg_.test(escapeRegExp(nextUserInput))) {
    //   onUserInput(nextUserInput)
    // }
  }

  const { address, loading, name } = useENS(value)
  const error = useMemo(() => {
    if (value && value.length > 0 && !loading && !address) return true
    return false
  }, [value, loading, address])

  const { t } = useTranslation()

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={(event) => {
        const input = event.target.value
        const withoutSpaces = input.replace(/\s+/g, '')
        enforcer(withoutSpaces)
      }}
      // universal input options
      inputMode="text"
      title={title}
      autoComplete="off"
      autoCorrect="off"
      hasError={error}
      // text-specific options
      type="text"
      // pattern="^(0x[a-fA-F0-9]{40})$"
      placeholder={placeholder}
      spellCheck="false"
    />
  )
})
const integerInputRegex = RegExp(`^\\d*$`) // match escaped "." 
export const StyledIntegerInput = React.memo(function InnerInput({
  value,
  onUserInput,
  title,
  placeholder,
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  title?: string
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || integerInputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  const { t } = useTranslation()

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={(event) => {
        // replace commas with periods, because we exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, ''))
      }}
      // universal input options
      inputMode="decimal"
      title={title}
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*$"
      placeholder={placeholder || '0'}
      minLength={1}
      maxLength={10}
      spellCheck="false"
    />
  )
})

const numericalInputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const StyledNumericalInput = React.memo(function InnerInput({
    value,
    onUserInput,
    title,
    placeholder,
    ...rest
  }: {
    value: string | number
    onUserInput: (input: string) => void
    title?: string
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || numericalInputRegex.test(escapeRegExp(nextUserInput))) {
        onUserInput(nextUserInput)
      }
    }
  
    const { t } = useTranslation()
  
    return (
      <StyledInput
        {...rest}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because we exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, '.'))
        }}
        // universal input options
        inputMode="decimal"
        title={title}
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || '0.0'}
        minLength={1}
        maxLength={79}
        spellCheck="false"
      />
    )
  })