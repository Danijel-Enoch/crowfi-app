import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import { StyledIntegerInput } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import { getNFTBundleAddress } from 'utils/addressHelpers'
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback'
import { NFTResponse } from '../../hooks/types'
import NFTRow from './NFTRow'
import NFTInfoSection from '../SellNFTModal/NFTInfoSection'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`
const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: scroll;
  max-height: calc(min(80vh, 400px));
`
enum SelectNFTModalView {
    review,
    list,
}

interface SelectNFTModalProps {
    nfts?: NFTResponse[]
    account: string
    onConfirm: (nft: NFTResponse, amount: number) => void
}

const SelectNFTModal: React.FC<InjectedModalProps & SelectNFTModalProps> = ({nfts, account, onConfirm, onDismiss}) => {

    const { t } = useTranslation()
    const [modalView, setModalView] = useState<SelectNFTModalView>(SelectNFTModalView.list)
    const [selectedNFT, setSelectedNFT] = useState<NFTResponse>(null)
    const [approval, approveCallback]  = useNFTApproveCallback(selectedNFT ? selectedNFT.contractAddress : undefined , getNFTBundleAddress())
    const [amount, setAmount] = useState('1')

    const modalTitle = useMemo(() => {
        if (modalView === SelectNFTModalView.list) {
            return t('Choose a NFT')
        }

        return t('Review')
    }, [modalView, t])

    const isInputValid = useMemo(() => {
      return selectedNFT && parseInt(amount) > 0 && parseInt(amount) <= selectedNFT.balance
    }, [selectedNFT, amount])

    const handleConfirm = () => {
        onConfirm(selectedNFT, parseInt(amount))
        onDismiss()
    }

    const renderApprovalOrSelectButton = () => {
        return account && approval === ApprovalState.APPROVED ? (
        <Button
            disabled={!isInputValid}
            scale="md" variant="primary" width="100%"
            onClick={handleConfirm}
        >
            {t('Select')}
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
                { modalView === SelectNFTModalView.review && (
                    <ModalBackButton onBack={() => setModalView(SelectNFTModalView.list)} />
                )}
                <Heading>{modalTitle}</Heading>
                </ModalTitle>
                <ModalCloseButton onDismiss={onDismiss} />
            </ModalHeader>
            {
                modalView === SelectNFTModalView.list ? (
                    <StyledModalBody>
                        <Flex flexDirection="column">
                            {nfts && nfts.map((nft) => {
                                return (
                                    <NFTRow key={nft.id} nft={nft} selectable onSelect={() => {
                                        setSelectedNFT(nft)
                                        setModalView(SelectNFTModalView.review)
                                    }}/>
                                )
                            })}
                        </Flex>
                    </StyledModalBody>
                ) : (
                    <>
                    <StyledModalBody>
                        <NFTInfoSection nft={selectedNFT} available={selectedNFT.balance}/>
                        <Flex  margin="8px 0px" flexDirection="column">
                            <Text fontSize='14px'>
                            {t('Token Amount:')}
                            </Text>
                            <StyledIntegerInput
                            value={amount}
                            onUserInput={(value) => setAmount(value)}
                            />
                        </Flex>
                        <ModalActions>
                            <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
                                {t('Cancel')}
                            </Button>
                            {renderApprovalOrSelectButton()}
                        </ModalActions>
                    </StyledModalBody>
                    </>
                )
            }
        </StyledModalContainer>
    )
}

export default SelectNFTModal