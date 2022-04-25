import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import NFTInfoSection from './NFTInfoSection'
import { NFTResponse } from '../../hooks/types'
import OfferSection from './OfferSection'

enum ViewMode {
    FIRST,
    OFFER
}

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`
const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TabButton = styled(Button)<{ active: boolean }>`
  ${({ active, theme }) =>
    active ?
    `
      color: ${theme.colors.primary}
    `
    :
    `
      color: ${theme.colors.primary};
      opacity: 0.3;
    `
  }
`

interface OfferNFTModalProps {
    nft: NFTResponse
    account: string
    available: number
    onComplete: () => void
}

const OfferNFTModal: React.FC<InjectedModalProps & OfferNFTModalProps> = ({ account, nft, available, onDismiss, onComplete }) => {
    const { t } = useTranslation()
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FIRST)
  
    return (
      <StyledModalContainer minWidth="320px">
        <ModalHeader>
          <ModalTitle>
              <>
              <Heading>{t('Offer')}</Heading>
              </>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </ModalHeader>
        <StyledModalBody>
            { viewMode === ViewMode.FIRST ? (
              <>
              <NFTInfoSection nft={nft} available={available}/>
              <ModalActions>
                <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
                  {t('Cancel')}
                </Button>
                <Button scale="md" variant="primary" onClick={() => {
                  setViewMode(ViewMode.OFFER)
                }} width="100%">
                  {t('Offer')}
                </Button>
              </ModalActions>
              </>
            )
            : 
            (
              <OfferSection nft={nft} account={account} available={available} onDismiss={onDismiss} onComplete={onComplete}/>
            )}
        </StyledModalBody>
      </StyledModalContainer>
    )
  }
  
  export default OfferNFTModal