import { serializeTokens } from './tokens'
import { PrivateSaleType, SerializedPrivateSaleConfig } from './types'

const serializedTokens = serializeTokens()
const privatesales: SerializedPrivateSaleConfig[] = [
    {
        type: PrivateSaleType.seedsale,
        name: 'Seed Sale',
        desc: 'Participate in the CrowFi seed sale and receive Crow Tokens at the best price possible!',
        price: 0.01,
        manager: {
            97: '0xFB45aF3Fe47334e8c3c1F6EaA8e9a1E17Df30f11',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
            338: '0xd343aE7540B92fE01688c37C8CCa19eaDcc32F76',
            25: '0xd343aE7540B92fE01688c37C8CCa19eaDcc32F76',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    },
    {
        type: PrivateSaleType.privatesale,
        name: 'Private Sale',
        desc: 'Participate in the exclusive CrowFi private sale to get tokens at an incredible price!',
        price: 0.015,
        manager: {
            97: '0x3b6d2c589a778FA053d1a4730895009d67BAa8DC',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
            338: '0xEB01b7f68035BFbCa7095410e4DE8385e9C53FE5',
            25: '0xEB01b7f68035BFbCa7095410e4DE8385e9C53FE5',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    },
    {
        type: PrivateSaleType.preSale,
        name: 'Public Pre Sale',
        desc: 'Join the public pre sale and receive tokens at a great price!',
        price: 0.018,
        manager: {
            97: '0x83Fe700A857d41DEA8FE340295Ce1c5e01350225',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
            338: '0xdEd4fb33637Cf5330e09a71ac410993651dcC65F',
            25: '0xdEd4fb33637Cf5330e09a71ac410993651dcC65F',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    }
]

export default privatesales