import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'lodash'
import { Button, Heading, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots';
import { StyledInputLabel, StyledIntegerInput, StyledTextarea } from 'components/Launchpad/StyledControls';
import useToast from 'hooks/useToast'
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback';
import { isAddress } from 'utils';
import { getNftMarketAddress } from 'utils/addressHelpers'
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

interface AirdropNFTModalProps {
  nft: NFTResponse
  account: string
  available: number
  onComplete?: () => void
}

const AirdropNFTModal: React.FC<InjectedModalProps & AirdropNFTModalProps> = ({ account, nft, available, onDismiss, onComplete }) => {

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const contractAddress = isAddress(nft.contractAddress)
  const [approval, approveCallback]  = useNFTApproveCallback(contractAddress === false ? undefined : contractAddress, getNftMarketAddress())
  const [pendingTx, setPendingTx] = useState(false)
  const [amount, setAmount] = useState('1')
  const [airdropText, setAirdropText] = useState<string>('')

  const {onAirdropNFT} = useTransferNFT()

  const airdropTextReg = RegExp(`^(0x[0-9a-fA-F]{40})*(0x[0-9a-fA-F]{40})$`)

  const isAirdopInputValid: boolean = useMemo(() => {
      return airdropText.length > 0 &&  airdropTextReg.test(escapeRegExp(airdropText))
  }, [airdropTextReg, airdropText])

  const tokensAirdropping: number = useMemo(() => {
      if (isAirdopInputValid) {
          return airdropText.split("\n").length * parseInt(amount)
      }
      return 0
  }, [isAirdopInputValid, airdropText, amount])

  const isInputValid = useMemo(() => {
    return tokensAirdropping > 0 && tokensAirdropping < available
  }, [available, tokensAirdropping])

  const handleTransfer = useCallback(async () => {
    try {
        setPendingTx(true)
        const receipients = airdropText.split("\n")
        await onAirdropNFT(receipients, contractAddress as string, nft.contractType.toString(), nft.tokenId.toString(), amount)
        toastSuccess(
        `${t('Success')}!`,
        t('The nft has been transferred to %count% addresses', {count: receipients.length})
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
  }, [t, toastSuccess, toastError, onAirdropNFT, onComplete, onDismiss, amount, airdropText, nft, contractAddress])

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
              <StyledTextarea
                  hasError={airdropText.length > 0 && !isAirdopInputValid}
                  value={airdropText}
                  placeholder={t('Distribution List')}
                  onUserInput={(val) => setAirdropText(val)}
              />
              <StyledInputLabel>
                  {t('Ex. 0x533C503d97C93B4ac1c6AE8D034c91A72FdF145F, 0x888D2F717Dc256617441F989591822dc8D376748, 0xe728546A7583a43c7fB56315B27953217B36fA1D,')}
              </StyledInputLabel>
              <StyledInputLabel>
                  {t('For best results we recommend you do a maximum of 500 Addresses at a time!')}
              </StyledInputLabel>
          </InputWrap>
          <InputWrap>
            <StyledIntegerInput
              placeholder={t('Enter token amount')}
              value={amount}
              onUserInput={(value) => setAmount(value)}
              error={isAirdopInputValid && !isInputValid}
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
  
export default AirdropNFTModal