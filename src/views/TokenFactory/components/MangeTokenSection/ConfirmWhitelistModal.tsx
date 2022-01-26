import React, { useCallback, useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { Flex, Text, InjectedModalProps, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { DeserializedTokenData } from 'state/types'
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from 'components/TransactionConfirmationModal'
import ConfirmModalFooter from './ConfirmModalFooter'
import { useLPGeneratorTokenWhitelistAddress } from '../../hooks/useLPGeneratorToken'



interface ConfirmWhitelistModalProps {
  token?: DeserializedTokenData
  address?: string
  isAdd: boolean
}

const ConfirmWhitelistModal: React.FC<InjectedModalProps & ConfirmWhitelistModalProps> = ({
  token,
  address,
  isAdd,
  onDismiss,
}) => {

  const { t } = useTranslation()
  const [txHash, setTxHash] = useState<string|undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined)
  const [pendingTx, setPendingTx] = useState(false)

  const { onAddToWhitelist, onRemoveFromWhitelist} = useLPGeneratorTokenWhitelistAddress(token.address)

  const modalHeader = useCallback(() => {
    return token && address ? (
      <Flex flexDirection="column">
        <Text color="secondary" mb="16px">
          {isAdd ? t('Are you sure you want to add in whitelist?') : t('Are you sure you want to remove from whitelist?')}
        </Text>
        <Flex justifyContent="space-between">
          <Text color="secondary" fontSize="14px">
            {t('Token')}
          </Text>
          <LinkExternal href={getBscScanLink(token.address, 'address')}>{token.symbol}</LinkExternal>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text color="secondary" fontSize="14px">
            {t('Address')}
          </Text>
          <Text color="primary">
            {truncateHash(address)}
          </Text>
        </Flex>
      </Flex>
    ) : null
  }, [token, address, t, isAdd])

  const onConfirm = useCallback(async () =>  {
    try {
      setPendingTx(true)
      const res = isAdd ? await onAddToWhitelist(address) : await onRemoveFromWhitelist(address)
      setTxHash(res)
    } catch (e) {
      setErrorMessage(t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingTx(false)
    }
  }, [t, isAdd, address, onAddToWhitelist, onRemoveFromWhitelist])

  const modalBottom = useCallback(() => {
    return token ? (
      <ConfirmModalFooter
        onConfirm={onConfirm}
        errorMessage={errorMessage}
      />
    ) : null
  }, [token, onConfirm, errorMessage])
  
  const confirmationContent = useCallback(
    () =>
      errorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={errorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, errorMessage],
  )


  return (
    <TransactionConfirmationModal
      title={isAdd ? t('Confirm Add to Whitelist') : t('Confirm Remove from Whitelist')}
      onDismiss={onDismiss}
      attemptingTxn={pendingTx}
      hash={txHash}
      content={confirmationContent}
      pendingText={isAdd ? t('Adding to whitelist') : t('Removing from whitelist')}
      currencyToAdd={token}
    />
  )
}

export default ConfirmWhitelistModal
