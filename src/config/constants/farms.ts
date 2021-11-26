import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 3) should always be at the top of the file.
   */
   {
    pid: 0,
    lpSymbol: 'BUSD-SPY',
    lpAddresses: {
      97: '0xa38F8964F9d9Ad4266494cDD8a5da8e58335f76a',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 1,
    lpSymbol: 'SPY-BNB LP',
    lpAddresses: {
      97: '0x42fc257C0fD445a504097Fa7fDE11DA4d3550639',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'SPY-MSC LP',
    lpAddresses: {
      97: '0xE322332287766B7f3a9ADfD7f4642F05eb668De8',
      56: '',
    },
    token: serializedTokens.msc,
    quoteToken: serializedTokens.spy,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0x7e22Bb130a3Fd9080bdEd79eb107d6716dCD1D3f',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
]

export default farms