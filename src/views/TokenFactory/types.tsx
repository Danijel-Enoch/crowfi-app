import BigNumber from "bignumber.js";

export enum TokenType {
    STANDARD = "STANDARD",
    LIQUIDITY = "LIQUIDITY"
}

export interface TokenData {
    type: TokenType
    address: string
    name: string
    symbol: string
    decimals: number
    totalSupply: BigNumber
}