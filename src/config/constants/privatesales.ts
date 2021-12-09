import { serializeTokens } from './tokens'
import { PrivateSaleType, SerializedPrivateSaleConfig } from './types'

const serializedTokens = serializeTokens()
const privatesales: SerializedPrivateSaleConfig[] = [
    {
        type: PrivateSaleType.seedsale,
        name: 'Seed Sale',
        price: 0.01,
        manager: {
            97: '0xFB45aF3Fe47334e8c3c1F6EaA8e9a1E17Df30f11',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    },
    {
        type: PrivateSaleType.privatesale,
        name: 'Private Sale',
        price: 0.015,
        manager: {
            97: '0x3b6d2c589a778FA053d1a4730895009d67BAa8DC',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    },
    {
        type: PrivateSaleType.preSale,
        name: 'Pre Sale',
        price: 0.018,
        manager: {
            97: '0x83Fe700A857d41DEA8FE340295Ce1c5e01350225',
            56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
        },
        tempToken: serializedTokens.pcrow,
        quoteToken: serializedTokens.usdc
    }
]

export default privatesales