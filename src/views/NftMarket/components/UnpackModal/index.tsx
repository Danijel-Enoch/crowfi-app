import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots'
import { NFTAsset, NFTResponse } from '../../hooks/types'
import { useGetBundleItems } from '../../hooks/useBundle'
import { useUnpackBundle } from '../../hooks/useCreateBundle'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`
const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: scroll;
  max-height: calc(min(80vh, 400px));
`

interface UnpackModalProps {
    bundle: NFTAsset|NFTResponse
    account: string
    onGoPath: (path) => void
}

const UnpackModal: React.FC<InjectedModalProps & UnpackModalProps> = ({bundle, account, onGoPath, onDismiss}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [bundleItems, setBundleItems] = useState([])
    const {onGetBundleItems} = useGetBundleItems()
    const {onUnpackBundle} = useUnpackBundle()

    useEffect(() => {
        const fetchBundleItems = async () => {
            const items = await onGetBundleItems(bundle.contractAddress, bundle.tokenId)
            setBundleItems(items)
        }
        if (account) {
            fetchBundleItems()
        }
    }, [account, bundle, onGetBundleItems])

    const handleUnpack = useCallback(async () => {

        try {
            setPendingTx(true)
            await onUnpackBundle(bundle.contractAddress, bundle.tokenId)
            toastSuccess(t('Success'), t('The bundle has been unpacked successfully.'))
            onGoPath('/nft/assets')
            onDismiss()
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

    }, [toastSuccess, toastError, t, bundle, onUnpackBundle, onGoPath, onDismiss])

    const renderApprovalOrUnpackButton = () => {
        return (
            <Button scale="md" variant="primary" disabled={pendingTx} onClick={handleUnpack} width="100%">
                {pendingTx ? (<Dots>{t('Unpacking')}</Dots>) : t('Unpack')}
            </Button>
        )
    }
    return (
        <StyledModalContainer minWidth="320px">
            <ModalHeader>
                <ModalTitle>
                <Heading>{t('Unpack')}</Heading>
                </ModalTitle>
                <ModalCloseButton onDismiss={onDismiss} />
            </ModalHeader>
            
            <StyledModalBody>
                <Text>
                    {t('Do you want to unpack this bundle?')}
                </Text>
                <ModalActions>
                    <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
                        {t('Cancel')}
                    </Button>
                    {renderApprovalOrUnpackButton()}
                </ModalActions>
            </StyledModalBody>
        </StyledModalContainer>
    )
}

export default UnpackModal