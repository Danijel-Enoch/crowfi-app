import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { escapeRegExp } from 'lodash'
import { Button, Heading, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots'
import useToast from 'hooks/useToast'
import { NFTAsset, NFTMeta } from '../../hooks/types'
import { useFreezeMetadata } from '../../hooks/useFreezeMeta'

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

const StepText = styled(Text)<{active?: boolean}>`
  opacity: 0.5;
  ${({ active, theme }) =>
  active &&
    `
    color: ${theme.colors.secondary};
    opacity: 1;
  `}
`
const DescText = styled(Text)<{active?: boolean}>`
  opacity: 0.5;
  font-size: 14px;
  ${({ active, theme }) =>
  active &&
    `
    opacity: 1;
  `}
`

interface FreezeMetadataModalModalProps {
  asset: NFTAsset
  meta?: NFTMeta
  onComplete?: () => void
}

const FreezeMetadataModalModal: React.FC<InjectedModalProps & FreezeMetadataModalModalProps> = ({ asset, meta, onDismiss, onComplete }) => {

  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [freezing, setFreezing] = useState(false)
  const [uri, setUri] = useState(null)
  const { toastError, toastSuccess } = useToast()
  const {onUploadMeta, onSetTokenURI} = useFreezeMetadata()

  const handleUploadMeta = useCallback(async () => {
    try {
      setUploading(true)
      const uri_ = await onUploadMeta(meta)
      setUri(uri_)
    } catch (e) {
      setUri(null)
      const error = e as any
      const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
      toastError(
          t('Error'),
          msg,
      )
    } finally {
      setUploading(false)
    }
  }, [meta, toastError, t, onUploadMeta])

  const handleFreeze = useCallback(async () => {
    try {
      setFreezing(true)
      await onSetTokenURI(asset, uri)
      toastSuccess(t('Success'), t('Your content has been freezed and it is decentralized now'))
      onComplete()
      onDismiss()
    } catch (e) {
      setUri(null)
      const error = e as any
      const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
      toastError(
          t('Error'),
          msg,
      )
    } finally {
      setFreezing(false)
    }
  }, [uri, asset, toastError, toastSuccess, t, onSetTokenURI, onComplete, onDismiss])
  
  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
            <Heading>{t('Freeze Metadata')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
          <Flex flexDirection="column" mx="16px">
            <StepText  active={!uri}>
              {t('1. Upload Metadata')}
            </StepText>
            <DescText mt="8px" active={!uri}>
              {t('By clicking Upload, your content is permantely stored in decentralized file storage (IPFS)')}
            </DescText>
            <StepText mt="16px" active={!!uri}>
              {t('2. Freeze Metadata')}
            </StepText>
            <DescText mt="8px" active={!!uri}>
              {t('By clicking Freeze, your content cannot be edited nor removed and it will appear as "Decentralized"')}
            </DescText>
          </Flex>
          <ModalActions>
            <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
              {t('Cancel')}
            </Button>
            {
              !uri ? (
                <Button scale="md" variant="primary" onClick={handleUploadMeta} width="100%" disabled={uploading}>
                  {uploading ? (<Dots>{t('Uploading')}</Dots>) : t('Upload')}
                </Button>
              ) : (
                <Button scale="md" variant="primary" onClick={handleFreeze} width="100%" disabled={freezing}>
                  {freezing ? (<Dots>{t('Freezing')}</Dots>) : t('Freeze')}
                </Button>
              )
            }
          </ModalActions>
      </StyledModalBody>
    </StyledModalContainer>
  )
}
  
export default FreezeMetadataModalModal