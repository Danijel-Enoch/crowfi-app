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

export interface PublicSaleData {
    address: string
    token: string
    owner: string
    wallet: string
    openingTime: number
    closingTime: number
    rate: BigNumber
    goal: BigNumber
    cap: BigNumber
    weiRaised: BigNumber
    finalized: boolean

    meta?: PublicSaleMetaData
}

export interface PublicSaleMetaData {
    website?: string
    github?: string
    twitter?: string
    reddit?: string
    telegram?: string
    description?: string
    logo?: string
}