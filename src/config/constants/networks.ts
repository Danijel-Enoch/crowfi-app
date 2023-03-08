import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://rpc.test.btcs.network',
  [ChainId.TESTNET]: 'https://rpc.test.btcs.network',
  [ChainId.CRONOS]: 'https://rpc.test.btcs.network',
  [ChainId.CRONOSTESTNET]: 'https://rpc.test.btcs.network'
  
}

export default NETWORK_URLS
