import { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

const pools: SerializedPoolConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: serializedTokens.crow,
  //   earningToken: serializedTokens.crow,
  //   contractAddress: {
  //     97: '0x65e5cB1992C1E5878c4EFDd465051D4e946Ab403',
  //     56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  //     338: '0x6D802Cc1111AD7c1485eBD1466A486855BcE7eAF',
  //     25: '0xddfba183782dAbe1518431EecAaF38fF7248a5Ba'
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '20',
  //   sortOrder: 1,
  //   isFinished: false,
  // },
  // {
  //   sousId: 1,
  //   stakingToken: serializedTokens.crow,
  //   earningToken: serializedTokens.usdc,
  //   contractAddress: {
  //     97: '',
  //     56: '',
  //     338: '0xa23ECb8BD14a3bC295F72076C72D32cFB4860313',
  //     25: ''
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '0.1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
]

export default pools