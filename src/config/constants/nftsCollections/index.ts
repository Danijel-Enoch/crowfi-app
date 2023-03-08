import { Collections, CollectionKey } from './types'

const collections: Collections = {
  [CollectionKey.CROWFI]: {
    name: 'CrowFi Bunnies',
    slug: 'crowfi-bunnies',
    address: {
      1115: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
      25: '0x60935F36e4631F73f0f407e68642144e07aC7f5E',
    },
  },
  [CollectionKey.SQUAD]: {
    name: 'CrowFi Squad',
    description: "CrowFi's first official generative NFT collection.. Join the squad.",
    slug: 'crowfi-squad',
    address: {
      1115: '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
      25: '0xEf12ef570300bFA65c4F022deAaA3dfF4f5d5c91',
    },
  },
}

export default collections
