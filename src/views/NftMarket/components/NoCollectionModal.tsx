import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Modal} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 8px 0px;
  background-color : ${({ theme }) => theme.colors.cardBorder};
`

interface NoCollectionModalProps {
  title?: string
  onDismiss?: () => void
  onAgree?: () => void
}


const NoCollectionModal: React.FC<NoCollectionModalProps> = ({
  title,
  onDismiss,
  onAgree
}) => {
  const { t } = useTranslation()

  return (
    <Modal title={title ?? t('Create NFT')}>
      <Text  mb="32px">
        {t('You don\'t have any collections. Get started by creating a collection now!')}
      </Text>
      
      <Flex justifyContent="flex-end">
        <Button variant="secondary" onClick={() => {
          onDismiss()
        }} mr="24px">
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            if (onAgree) {
              onAgree()
            }
            onDismiss()
          }}
        >
          {t('Get Started')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default NoCollectionModal
