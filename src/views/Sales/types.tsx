import BigNumber from "bignumber.js";

export enum TokenType {
    STANDARD = "STANDARD",
    LIQUIDITY = "LIQUIDITY"
}

export enum UnlockType {
    LINEAR = "LINEAR",
    FULL = "FULL"
}

export enum OwnerType {
    ME = "ME",
    OTHER = "OTHER"
}

export enum PaymentType {
    ESCROW = "ESCROW",
    DIRECT = "DIRECT"
}

export interface PublicSaleData {
    address: string
    token: string
    owner: string
    useETH: boolean
    baseToken: string
    wallet?: string
    openingTime: number
    closingTime: number
    unlockTime?: number
    rate: BigNumber
    rateDecimals: number
    listingRate: BigNumber
    listingRateDecimals: number
    liquidity: number
    goal: BigNumber
    cap: BigNumber
    minContribution?: BigNumber
    maxContribution?: BigNumber
    weiRaised: BigNumber
    finalized: boolean
    canceled: boolean
    deposited: boolean
    logo?: string
    whitelistEnabled?: boolean
    paymentType?: PaymentType
    lockId?: number

    meta?: PublicSaleMetaData
}

export interface PublicSaleMetaData {
    website?: string
    twitter?: string
    facebook?: string
    telegram?: string
    instagram?: string
    github?: string
    discord?: string
    reddit?: string
    description?: string
}