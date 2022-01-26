import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, LinkExternal, Skeleton, MetamaskIcon } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils';
import { PairToken, useToken } from 'hooks/Tokens';
import useTotalSupply from 'hooks/useTotalSupply';
import truncateHash from 'utils/truncateHash'
import { registerToken } from 'utils/wallet'
import { Token } from '@pancakeswap/sdk'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { format } from 'date-fns'
import { LockType } from 'state/types'


const ModalInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 0px 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 48px;
  }
`

interface SuccessModalProps {
  type: LockType
  token: Token
  lockedAmount: BigNumber
  unlockAt: Date
  customOnDismiss?: () => void
}

const SuccessModal: React.FC<InjectedModalProps & SuccessModalProps> = ({ type, token, lockedAmount, unlockAt, customOnDismiss, onDismiss }) => {
  const { t } = useTranslation()

  const totalSupply = useTotalSupply(token)

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  return (
    <Modal title={t('Lock Created')} onDismiss={handleDismiss}>

      <ModalInnerContainer>

        <Heading textAlign="center" color="primary" mb="16px">
          {t('Your token has been locked successfully!')}
        </Heading>
        <Flex flexDirection="column" width="400px" maxWidth="100%" margin="auto">
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Type')}:</Text>
            <Text color="primary">{type === LockType.NORMAL ? t('Standard') : t('Liquidity')}</Text>
          </Flex>
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Name')}:</Text>
            { token ? (
              <Text color="primary">{token.name}</Text>
            ) : (
              <Skeleton height="22px" width="60px" />
            )}
          </Flex>
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Symbol')}:</Text>
            { token ? (
              <Text color="primary">{token.symbol}</Text>
            ) : (
              <Skeleton height="22px" width="60px" />
            )}
          </Flex>
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Total Supply')}:</Text>
            { totalSupply ? (
              <Text color="primary" textAlign="right">{totalSupply.toExact()} {token ? token.symbol : ''}</Text>
            ) : (
              <Skeleton height="22px" width="60px" />
            )}
          </Flex>
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Locked Amont')}:</Text>
            <Text color="primary">{getFullDisplayBalance(lockedAmount, token.decimals)}  {token ? token.symbol : ''}</Text>
          </Flex>
          <Flex justifyContent="space-between" mb="4px">
            <Text color="secondary" mr="8px">{t('Unlock at')}:</Text>
            <Text color="primary">{format(unlockAt, 'MM/dd/yyyy hh:mm aa')}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="secondary" mr="8px">{t('Token Address')}:</Text>
            <LinkExternal href={getBscScanLink(token.address, 'address')}>{truncateHash(token.address)}</LinkExternal>
          </Flex>
          <Flex justifyContent="center" mt="16px">
          <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() => registerToken(token.address, token.symbol, token.decimals)}
            >
            <Text color="primary">{t('Add to Metamask')}</Text>
            <MetamaskIcon ml="4px" />
          </Button>
          </Flex>
        </Flex>
      <ModalActions>
        <Button variant="primary" onClick={handleDismiss} width="100%">
          {t('OK')}
        </Button>
      </ModalActions>
      </ModalInnerContainer>
    </Modal>
  )
}

export default SuccessModal
