import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 3) should always be at the top of the file.
   */
   {
    pid: 1,
    lpSymbol: 'USDC-CROW LP',
    lpAddresses: {
      97: '0xe9412a9809FadBbaCd8D1bd024E6280f05Bd2437',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      338: '0xe59179D3Dd34C1d33Cb938e29618aa9B11B4A073',
      25: '0xC97403Ba8aCbbeA1B533a00934D1EFCa8F909DE4',
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
      338: '0xEf5b46555a8548b3E7CaCcB8511926643c8e7Ba2',
      25: '0x40DBBb02F2EeBc64a53Bad613aB45B792ECB7CF8'
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
      338: '0xed55E937966d1B2190Ce9A8D7B27619c1996EFAb',
      25: '0x47898687BEF55419e29F61f64cF8B452aFB1CaDA',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wcro,
  }
]

export default farms