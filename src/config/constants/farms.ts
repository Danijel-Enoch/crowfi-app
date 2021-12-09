import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 3) should always be at the top of the file.
   */
   {
    pid: 1,
    lpSymbol: 'USDC-CROW',
    lpAddresses: {
      97: '0xe9412a9809FadBbaCd8D1bd024E6280f05Bd2437',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      338: '0x360402fEC9663d19A60646E057129AD71722F173',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.crow,
  },
  {
    pid: 2,
    lpSymbol: 'CROW-CRO LP',
    lpAddresses: {
      97: '0xe890519b297700BB69a62F18AaA50cAc201A300C',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      338: '0x50FEEEc566A9DFF6E012A970934b9b5B296F2191'
    },
    token: serializedTokens.crow,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 3,
    lpSymbol: 'USDC-CRO LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      338: '0xfdc06C084f62109fe23566cf26a2c8aCe9a7Aa90',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wcro,
  }
]

export default farms