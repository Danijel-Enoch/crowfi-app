import { ChainId } from '@pancakeswap/sdk'
import store from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  // return GAS_PRICE_GWEI.cronos;
  const chainId = process.env.REACT_APP_CHAIN_ID
  const state = store.getState()
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default
  return userGas;
  // return chainId === ChainId.CRONOS.toString() ? userGas : GAS_PRICE_GWEI.testnet
}

export default getGasPrice
