import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useSimpleTokenFactory, useTokenFactory } from 'hooks/useContract'
import { createLiquidityToken, createStandardToken } from 'utils/calls/tokenFactory'
import { useWeb3React } from '@web3-react/core'
import { ROUTER_ADDRESS } from 'config/constants'

export const useCreateStandardToken = () => {
  const tokenFactory = useSimpleTokenFactory()
  const { account } = useWeb3React()

  const handleCreateToken = useCallback(
    async (feeAmount, tokenName, symbol, supply, decimals) => {
      const txHash = await createStandardToken(tokenFactory, feeAmount, tokenName, symbol, decimals, supply, ROUTER_ADDRESS, account)
      console.info(txHash)
    },
    [tokenFactory, account],
  )

  return { onCreateToken: handleCreateToken }
}


export const useCreateLiquidityToken = () => {
  const tokenFactory = useTokenFactory()
  const { account } = useWeb3React()

  const handleCreateToken = useCallback(
    async (feeAmount, tokenName, symbol, supply, decimals, txFee, lpFee, dexFee, devAddress) => {
      const txHash = await createLiquidityToken(tokenFactory, feeAmount, tokenName, symbol, decimals, supply, txFee, lpFee, dexFee, ROUTER_ADDRESS, devAddress, account)
      console.info(txHash)
    },
    [tokenFactory, account],
  )

  return { onCreateToken: handleCreateToken }
}
