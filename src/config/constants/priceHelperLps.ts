import tokens from './tokens'
import { SerializedFarmConfig } from './types'

const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      1115: '0xCe243775e7ec6Dac5702F60a597Ce06344fC60F0',
      25: '0x7b3ae32eE8C532016f3E31C8941D937c59e055B9',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
]

export default priceHelperLps
