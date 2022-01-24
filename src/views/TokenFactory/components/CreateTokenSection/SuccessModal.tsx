import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, LinkExternal, Skeleton, MetamaskIcon } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils';
import { useToken } from 'hooks/Tokens';
import useTotalSupply from 'hooks/useTotalSupply';
import truncateHash from 'utils/truncateHash'
import { registerToken } from 'utils/wallet'


const ModalInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 0px 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 48px;
  }
`

const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  > img {
    width: 300px;
    max-width: calc(90vw - 120px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      max-width: calc(100vw - 144px);
    }
  }
`

interface SuccessModalProps {
  tokenAddress: string
  customOnDismiss?: () => void
}

const SuccessModal: React.FC<InjectedModalProps & SuccessModalProps> = ({ tokenAddress, customOnDismiss, onDismiss }) => {
  const { t } = useTranslation()

  const token = useToken(tokenAddress)
  const totalSupply = useTotalSupply(token)

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  return (
    <Modal title={t('Token Created')} onDismiss={handleDismiss}>

      <ModalInnerContainer>

        <Heading textAlign="center" color="primary" mb="16px">
          {t('Your token has been created successfully!')}
        </Heading>
        <Flex flexDirection="column" width="300px" maxWidth="100%" margin="auto">
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
              <Text color="primary">{totalSupply.toExact()} {token ? token.symbol : ''}</Text>
            ) : (
              <Skeleton height="22px" width="60px" />
            )}
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="secondary" mr="8px">{t('Address')}:</Text>
            <LinkExternal href={getBscScanLink(tokenAddress, 'address')}>{truncateHash(tokenAddress)}</LinkExternal>
          </Flex>
          {token && (
          <Flex justifyContent="center" mt="16px">
          <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() => registerToken(tokenAddress, token.symbol, token.decimals)}
            >
            <Text color="primary">{t('Add to Metamask')}</Text>
            <MetamaskIcon ml="4px" />
          </Button>
          </Flex>
          )}
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
