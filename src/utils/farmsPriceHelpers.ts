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
  preferredQuoteTokens: string[] = ['BUSD', 'WBNB'],
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

export const getBNBPriceUSD = async (
): Promise<BigNumber> => {
  try {
    const res = await fetch(`https://api.pancakeswap.info/api/v2/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`)

    if (res.ok) {
      try {
        const data:TokenInfoResponse = await res.json()
        return BIG_ONE.div(new BigNumber(data.data.price_BNB));
      } catch (e) {
        return BIG_ZERO;
      }
    }
  } catch (_) {
    const hardcodedJson = `{"updated_at":1639041391172,"data":{"name":"BUSD Token","symbol":"BUSD","price":"0.999705860394396670805082377575","price_BNB":"0.001681418294899835487339371856298"}}`;
    try {
      const data:TokenInfoResponse = JSON.parse(hardcodedJson)
      return BIG_ONE.div(new BigNumber(data.data.price_BNB));
    } catch (e) {
      return BIG_ZERO;
    }
  }
  
  return BIG_ZERO;
}
