import React, { useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'
import { Flex, Button, Text, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'

export default function ConfirmModalHeader({
  token,
  receipts,
  amounts
}: {
    token: Token,
    receipts: string[],
    amounts: string[]
}) {
  const { t } = useTranslation()

  return (
      <>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text color="secondary" fontSize="14px">
            {t('Token')}
          </Text>
          <LinkExternal href={getBscScanLink(token.address, 'address')}>{token.symbol}</LinkExternal>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text color="secondary" fontSize="14px">
            {t('Receipts')}
          </Text>
          <Text color="primary">
            {receipts ? receipts.length : 0}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text color="secondary" fontSize="14px">
            {t('Total Amount')}
          </Text>
          <Text color="primary">
            {getFullDisplayBalance(amounts.reduce((acum, amount) => {
              return acum.plus(new BigNumber(amount))
            }, BIG_ZERO), token.decimals)}
          </Text>
        </Flex>
      </Flex>
      </>
  )
}
