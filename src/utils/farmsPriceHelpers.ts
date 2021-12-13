import BigNumber from 'bignumber.js'
import { SerializedFarm } from 'state/types'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (
  farms: SerializedFarm[],
  preferredQuoteTokens: string[] = ['USDC', 'WCRO'],
): SerializedFarm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export interface TokenInfoResponse {
  data: TokenInfo
}

/* eslint-disable camelcase */
export interface TokenInfo {
  price: string,
  price_BNB: string,
  name: string,
  symbol: string
}
