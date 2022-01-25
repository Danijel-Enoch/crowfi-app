import React, { useCallback, useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { Flex, Text, InjectedModalProps, LinkExternal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { DeserializedTokenData } from 'state/types'
import { getFullDisplayBalance, getFullDisplayBalanceExact } from 'utils/formatBalance'
import TransactionConfirmationModal, { ConfirmationModalContent, TransactionErrorContent } from 'components/TransactionConfirmationModal'
import ConfirmModalFooter from './ConfirmModalFooter'
import { useBurnStandardToken } from '../../hooks/useStandardToken'



interface ConfirmBurnModalProps {
  token?: DeserializedTokenData
  amount?: BigNumber
  onComplete?: () => void
}

const ConfirmBurnModal: React.FC<InjectedModalProps & ConfirmBurnModalProps> = ({
  token,
  amount,
  onDismiss,
  onComplete,
}) => {

  const { t } = useTranslation()
  const [txHash, setTxHash] = useState<string|undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined)
  const [pendingTx, setPendingTx] = useState(false)

  const { onBurnToken } = useBurnStandardToken(token.address)

  const modalHeader = useCallback(() => {
    return token && amount ? (
      <Flex flexDirection="column">
        <Text color="secondary" mb="16px">
          {t('Are you sure you want to burn?')}
        </Text>
        <Flex justifyContent="space-between">
          <Text color="secondary" fontSize="14px">
            {t('Token')}
          </Text>
          <LinkExternal href={getBscScanLink(token.address, 'address')}>{token.symbol}</LinkExternal>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text color="secondary" fontSize="14px">
            {t('Amount')}
          </Text>
          <Text color="primary">
            {getFullDisplayBalanceExact(amount, token.decimals)}
          </Text>
        </Flex>
      </Flex>
    ) : null
  }, [token, amount, t])

  const onConfirm = useCallback(async () =>  {
    try {
      setPendingTx(true)
      const res = await onBurnToken(amount.toJSON())
      setTxHash(res)
      onComplete()
    } catch (e) {
      console.log('exception', e)
      setErrorMessage(t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setPendingTx(false)
    }
  }, [t, onComplete, amount, onBurnToken])

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
      title={t('Confirm Burn')}
      onDismiss={onDismiss}
      attemptingTxn={pendingTx}
      hash={txHash}
      content={confirmationContent}
      pendingText={token ? t('Burning %amount% %symbol%', {amount:getFullDisplayBalanceExact(amount, token.decimals), symbol: token.symbol}) : ''}
      currencyToAdd={token}
    />
  )
}

export default ConfirmBurnModal
