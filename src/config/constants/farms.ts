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
      97: '0xe9412a9809FadBbaCd8D1bd024E6280f05Bd2437',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.spy,
  },
  {
    pid: 1,
    lpSymbol: 'SPY-BNB LP',
    lpAddresses: {
      97: '0xe890519b297700BB69a62F18AaA50cAc201A300C',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.wbnb,
  },
  // {
  //   pid: 3,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '0xCe243775e7ec6Dac5702F60a597Ce06344fC60F0',
  //     56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: serializedTokens.busd,
  //   quoteToken: serializedTokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'SPY-MSC LP',
  //   lpAddresses: {
  //     97: '0xeF4485D7242B1D400A4CCb1304cc278cA4096914',
  //     56: '',
  //   },
  //   token: serializedTokens.spy,
  //   quoteToken: serializedTokens.msc,
  // },
]

export default farms