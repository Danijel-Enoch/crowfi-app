import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { DeserializedTokenData, State, TokenType } from '../types'
import { fetchTokenFactoryPublicDataAsync, fetchTokenFactoryUserDataAsync } from '.'


export const usePollTokenFactoryData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    dispatch(fetchTokenFactoryPublicDataAsync())
    if (account) {
      dispatch(fetchTokenFactoryUserDataAsync({account}))
    }
  }, [dispatch, slowRefresh, account])
}

export const useMyTokens = () : DeserializedTokenData[] => {
  const serializedTokens =  useSelector((state: State) => state.tokenFactory.userTokens)

  if (!serializedTokens) {
    return []
  }

  return serializedTokens.map((token) => {
    const {type, address, symbol, name, decimals, totalSupply, lpFee, taxFee} = token
    return {
      type: type === 0 ? TokenType.STANDARD : TokenType.LIQUIDITY,
      address,
      symbol,
      name,
      decimals,
      totalSupply: new BigNumber(totalSupply),
      lpFee: lpFee? new BigNumber(lpFee) : undefined,
      taxFee: taxFee? new BigNumber(taxFee) : undefined,
    }
  })
}

export const useTokensCreated = () => {
  const totalTokens = useSelector((state: State) => state.tokenFactory.totalTokens)
  return totalTokens ? new BigNumber(totalTokens) : undefined
}

export const useTokenFactoryDeployeFee = () => {
  const fee = useSelector((state: State) => state.tokenFactory.deployFee)
  return fee ? new BigNumber(fee) : undefined
}

export const useLiquidityTokenFactoryDeployeFee = () => {
  const fee = useSelector((state: State) => state.tokenFactory.lpDeployFee)
  return fee ? new BigNumber(fee) : undefined
}
