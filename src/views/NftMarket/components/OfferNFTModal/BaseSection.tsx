import React, { useMemo } from 'react'
import { Button, Flex, Text } from '@pancakeswap/uikit'
import { ETHER,TokenAmount, JSBI } from '@pancakeswap/sdk';
import Dots from 'components/Loader/Dots';
import tokens from 'config/constants/tokens'
import { ModalActions } from 'components/Modal';
import { NFTResponse } from 'views/NftMarket/hooks/types';
import { useTranslation } from 'contexts/Localization';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getNftMarketAddress } from 'utils/addressHelpers';
import { isAddress } from 'utils';
import { BIG_TEN } from 'utils/bigNumber';
import NFTInfoSection from './NFTInfoSection'


interface BaseSectionProps {
  nft: NFTResponse
  account?: string
  available: number
  useToken?: boolean
  handleCreate: () => void
  onDismiss: () => void
  pendingTx: boolean
  isInputValid: boolean
}

const BaseSection: React.FC<BaseSectionProps> = ({ nft, account, available, useToken, handleCreate, pendingTx, isInputValid, onDismiss, children }) => {
  const { t } = useTranslation()

  const tokenDecimals = useMemo(() => {
      return useToken ? ETHER.decimals : tokens.usdc?.decimals
  }, [useToken])
  const [approval, approveCallback] = useApproveCallback(useToken ? new TokenAmount(tokens.usdc, JSBI.BigInt(BIG_TEN)) : undefined, getNftMarketAddress())

  const renderApprovalOrSellButton = () => {
    return account && (!useToken || approval === ApprovalState.APPROVED) ? (
      <Button
        scale="md" variant="primary" width="100%"
        disabled={pendingTx || !isInputValid}
        onClick={handleCreate}
      >
        {pendingTx ? (
          <Dots>{t('Processing')}</Dots>
        ) : t('Create Offer')}
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

BaseSection.defaultProps = {
  useToken: false
}

export default BaseSection
