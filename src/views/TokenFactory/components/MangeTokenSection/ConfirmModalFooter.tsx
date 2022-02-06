import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, AutoRenewIcon, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'


const CallbackErrorInner = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure}33`};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.colors.failure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const CallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure}33`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function CallbackError({ error }: { error: string }) {
  return (
    <CallbackErrorInner>
      <CallbackErrorInnerAlertTriangle>
        <ErrorIcon width="24px" />
      </CallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </CallbackErrorInner>
  )
}

export default function ConfirmModalFooter({
  onConfirm,
  errorMessage,
}: {
  onConfirm: () => void
  errorMessage: string | undefined
}) {
  const { t } = useTranslation()

  return (
    <>

      <AutoRow>
        <Button
          variant="primary"
          onClick={onConfirm}
          mt="12px"
          width="100%"
        >
          {t('Confirm')}
        </Button>

        {errorMessage ? <CallbackError error={errorMessage} /> : null}
      </AutoRow>
    </>
  )
}
