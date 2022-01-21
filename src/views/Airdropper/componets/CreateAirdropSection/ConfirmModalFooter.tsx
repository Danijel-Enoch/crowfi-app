import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Text, AutoRenewIcon, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'

const AirdropModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const AirdropCallbackErrorInner = styled.div`
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

const AirdropCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => `${theme.colors.failure}33`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function AirdropCallbackError({ error }: { error: string }) {
  return (
    <AirdropCallbackErrorInner>
      <AirdropCallbackErrorInnerAlertTriangle>
        <ErrorIcon width="24px" />
      </AirdropCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </AirdropCallbackErrorInner>
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
          {t('Confirm Airdrop')}
        </Button>

        {errorMessage ? <AirdropCallbackError error={errorMessage} /> : null}
      </AutoRow>
    </>
  )
}
