import { Token, ChainId } from '@pancakeswap/sdk'
import tokens from './tokens'
import farms from './farms'
import { Ifo } from './types'

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const cakeBnbLpToken = new Token(chainId, farms[1].lpAddresses[chainId], 18, farms[1].lpSymbol)

const ifos: Ifo[] = [
]

export default ifos
