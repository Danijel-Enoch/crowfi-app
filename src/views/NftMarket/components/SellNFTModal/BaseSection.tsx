import React from 'react'
import { Button, Flex, Text } from '@pancakeswap/uikit'
import Dots from 'components/Loader/Dots';
import { ModalActions } from 'components/Modal';
import { NFTResponse } from 'views/NftMarket/hooks/types';
import { useTranslation } from 'contexts/Localization';
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback';
import { getNftMarketAddress } from 'utils/addressHelpers';
import { isAddress } from 'utils';
import NFTInfoSection from './NFTInfoSection'


interface BaseSectionProps {
  nft: NFTResponse
  account?: string
  available: number
  handleSell: () => void
  onDismiss: () => void
  pendingTx: boolean
  isInputValid: boolean
}

const BaseSection: React.FC<BaseSectionProps> = ({ nft, account, available, handleSell, pendingTx, isInputValid, onDismiss, children }) => {
  const { t } = useTranslation()
  const contractAddress = isAddress(nft.contractAddress)
  const [approval, approveCallback]  = useNFTApproveCallback(contractAddress === false ? undefined : contractAddress, getNftMarketAddress())

  const renderApprovalOrSellButton = () => {
    return account && approval === ApprovalState.APPROVED ? (
      <Button
        scale="md" variant="primary" width="100%"
        disabled={pendingTx || !isInputValid}
        onClick={handleSell}
      >
        {pendingTx ? (
          <Dots>{t('Processing')}</Dots>
        ) : t('Sell')}
      </Button>
    ) : (
      <Button scale="md" variant="primary" width="100%" disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
      </Button>
    )
  }

  return (
    <>
    <NFTInfoSection nft={nft} available={available}/>
    { children }
    <ModalActions>
      <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
        {t('Cancel')}
      </Button>
      {renderApprovalOrSellButton()}
    </ModalActions>
    </>
  )
}

export default BaseSection
