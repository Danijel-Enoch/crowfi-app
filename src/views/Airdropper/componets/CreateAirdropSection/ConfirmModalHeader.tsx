import React, { useMemo } from 'react'
import { Token, Trade, TradeType } from '@pancakeswap/sdk'
import { Flex, Button, Text, ErrorIcon, ArrowDownIcon, LinkExternal } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'

export default function ConfirmModalHeader({
  token,
  receipts,
  amounts
}: {
    token: Token,
    receipts: string[],
    amounts: BigNumber[]
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
              return acum.plus(amount)
            }), token.decimals)}
          </Text>
        </Flex>
      </Flex>
      </>
  )
}
