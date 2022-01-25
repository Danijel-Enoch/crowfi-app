import { useLiquidityGeneratorTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ChainId, Token } from '@pancakeswap/sdk'
import multicall from 'utils/multicall'
import { ERC20_ABI } from 'config/abi/erc20'
import { DeserializedTokenData, TokenType } from 'state/types'


export const fetchStandardTokens = async (chainId: ChainId, account: string, addresses: string[]): Promise<Token[]> => {

  const calls = addresses.reduce((accum, address, index) => {
      accum.push({
          address,
          name: 'name',
          params: []
      })
      accum.push({
          address,
          name: 'symbol',
          params: []
      })
      accum.push({
          address,
          name: 'decimals',
          params: []
      })
      accum.push({
          address,
          name: 'totalSupply',
          params: []
      })
      return accum
  }, [])

  const response = await multicall(ERC20_ABI, calls)
  const res = response.reduce((accum: any[][], item, index) => {
      const chunk = Math.floor(index / 4)
      const chunks = accum
      chunks[chunk] = ([] as any[]).concat(accum[chunk] || [], item)
      return chunks
  }, []).map((item, index) => {
    return new Token(chainId, addresses[index], item[2], item[1], item[0])
  })
  return res
}