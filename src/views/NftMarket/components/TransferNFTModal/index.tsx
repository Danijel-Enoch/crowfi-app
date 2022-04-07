import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots';
import { StyledAddressInput, StyledIntegerInput } from 'components/Launchpad/StyledControls';
import useToast from 'hooks/useToast'
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback';
import { isAddress } from 'utils';
import { getNftMarketAddress } from 'utils/addressHelpers'
import truncateHash from 'utils/truncateHash'
import NFTInfoSection from '../SellNFTModal/NFTInfoSection'
import { NFTResponse } from '../../hooks/types'
import { useTransferNFT } from '../../hooks/useTransferNFT'

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
const InputWrap = styled.div`
    padding: 8px 0px;
`

interface TransferNFTModalProps {
  nft: NFTResponse
  account: string
  available: number
  onComplete?: () => void
}

const TransferNFTModal: React.FC<InjectedModalProps & TransferNFTModalProps> = ({ account, nft, available, onDismiss, onComplete }) => {

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const contractAddress = isAddress(nft.contractAddress)
  const [approval, approveCallback]  = useNFTApproveCallback(contractAddress === false ? undefined : contractAddress, getNftMarketAddress())
  const [pendingTx, setPendingTx] = useState(false)
  const [amount, setAmount] = useState('1')
  const [receipient, setReceipient] = useState('')

  const {onTransferNFT} = useTransferNFT()

  const isInputValid = useMemo(() => {
    return parseInt(amount) > 0 && parseInt(amount) < available && isAddress(receipient)
  }, [amount, available, receipient])

  const handleTransfer = useCallback(async () => {
    try {
        setPendingTx(true)
        await onTransferNFT(receipient, contractAddress as string, nft.contractType.toString(), nft.tokenId.toString(), amount)
        toastSuccess(
        `${t('Success')}!`,
        t('The nft has been transferred to %receipient%', {receipient: truncateHash(receipient)})
        )
        onDismiss()
        onComplete()
    } catch (e) {
        const error = e as any
        const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
        toastError(
            t('Error'),
            msg,
        )
    } finally {
      setPendingTx(false)
    }
  }, [t, toastSuccess, toastError, onTransferNFT, onComplete, onDismiss, amount, receipient, nft, contractAddress])

  const renderApprovalOrTransferButton = () => {
    return account && approval === ApprovalState.APPROVED ? (
      <Button
        scale="md" variant="primary" width="100%"
        disabled={pendingTx || !isInputValid}
        onClick={handleTransfer}
      >
        {pendingTx ? (
          <Dots>{t('Processing')}</Dots>
        ) : t('Transfer')}
      </Button>
    ) : (
      <Button scale="md" variant="primary" width="100%" disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
      </Button>
    )
  }
  
  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
            <Heading>{t('Transfer NFT')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
          <NFTInfoSection nft={nft} available={available}/>
          <InputWrap>
            <StyledAddressInput 
              value={receipient} 
              placeholder={t('Enter receipient address')}
              onUserInput={(value) => setReceipient(value)} />
          </InputWrap>
          <InputWrap>
            <StyledIntegerInput
              placeholder={t('Enter token amount')}
              value={amount}
              onUserInput={(value) => setAmount(value)}
              error={parseInt(amount) <= 0 || parseInt(amount) > available}
            />
          </InputWrap>
          <ModalActions>
            <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
              {t('Cancel')}
            </Button>
            {renderApprovalOrTransferButton()}
          </ModalActions>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
  
export default TransferNFTModal