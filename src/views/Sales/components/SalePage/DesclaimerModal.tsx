import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Modal} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import CheckboxWithText from 'components/Launchpad/CheckboxWithText'

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 8px 0px;
  background-color : ${({ theme }) => theme.colors.cardBorder};
`

interface DesclaimerModalProps {
  onDismiss?: () => void
  onCancel?: () => void
  onAgree?: () => void
}


const DesclaimerModal: React.FC<DesclaimerModalProps> = ({
  onDismiss,
  onAgree,
  onCancel
}) => {
  const { t } = useTranslation()

  const [values, setValues ] = useState<boolean[]>([false, false, false, false, false, false, false, false])

  const desclaimers = [
    t('My token has a function to disable special transfers or has no special transfers'),
    t('My token is not already listed on  CrowFi Swap and I have not given out any tokens to users'),
    t('I understand tokens deposited to the PRESALE contract are non-recoverable (Regardless of success or failure)'),
    t('I understand fees paid to launch a PRESALE are non-recoverable'),
    t('I understand that I have to finalize my PreSale within 48 hours of hitting the hardcap!'),
    t('I am using CrowFi PRESALE as a software tool only and am alone responsible for anything I create on it'),
    t('I understand that I am responsible for following my local laws and regulations including KYC and AML practices.'),
    t('I have read and agree to the terms and conditions'),
  ]

  const onToggleValue = (index: number, checked: boolean) => {
    const val = [...values]
    if (index === -1) {
      setValues([checked, checked, checked, checked, checked, checked, checked, checked])
    } else {
      val[index] = checked
      setValues(val)
    }
    
  }

  const isValid: boolean = useMemo(() => {
    return values.filter((val) => !val).length === 0
  }, [values])

  return (
    <Modal title={t('Desclaimer')} hideCloseButton>
      <Text fontSize='12px' color="secondary" mb="16px">
        {t('Please agree to all the following to proceed!')}
      </Text>
      { 
      /* eslint-disable react/no-array-index-key */
      desclaimers.map((text, index) => (
        <CheckboxWithText
          key={`a${index}`}
          text={text}
          checked={values[index]}
          onClick={() => onToggleValue(index, !values[index])}
        />
      )) 
      /* eslint-enable react/no-array-index-key */
      }

      <Line/>

      <CheckboxWithText
        text={t('Agree to all')}
        checked={isValid}
        onClick={() => onToggleValue(-1, !isValid)}
      />

      
      <Flex justifyContent="flex-end">
        <Button variant="secondary" onClick={() => {
          if (onCancel) {
            onCancel()
          }
          onDismiss()
        }} mr="24px">
          {t('Cancel')}
        </Button>
        <Button
          disabled={!isValid}
          onClick={() => {
            if (onAgree) {
              onAgree()
            }
            onDismiss()
          }}
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default DesclaimerModal
