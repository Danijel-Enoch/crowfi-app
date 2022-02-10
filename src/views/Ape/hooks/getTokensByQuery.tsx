import { AddressZero } from '@ethersproject/constants'
import { ChainId, Token } from '@pancakeswap/sdk';
import BigNumber from "bignumber.js";
import { INFO_CLIENT } from "config/constants/endpoints";
import request, { gql } from "graphql-request"
import { PairToken } from 'hooks/Tokens';
import { BIG_TEN } from 'utils/bigNumber';
import { CronosPairToken } from '../typs';


interface SaleFields {
    id: string
    token: {
        id: string
    }
    owner: string
    useEth: boolean
    baseToken: {
        id: string
    }
    openingTime: string
    closingTime: string
    unlockTime: string
    rate: string
    rateDecimals: string
    listingRate: string
    listingRateDecimals: string
    liquidityPercent: string
    softCap: string
    hardCap: string
    minContribution: string
    maxContribution: string
    weiRaised: string
    finalized: boolean
    canceled: boolean
    deposited: boolean
    whitelistEnabled: boolean
}

interface Pair {
    id: string
    totalSupply: string,
    timestamp: string,
    token0: {
        id: string
        name: string
        symbol: string
        decimals: string
    },
    token1: {
        id: string
        name: string
        symbol: string
        decimals: string
    }
}

interface PairTokenQueryResponse {
    pairs: Pair[]
}
  

export const getPairsByQuery = async () : Promise<CronosPairToken[]> => {
    if (process.env.REACT_APP_CHAIN_ID === '338') {
        return [];
    }

    const query = gql`
        query search_pairs {
            pairs: pairs(first: 100, orderBy:timestamp orderDirection:asc, where:{totalSupply_not:0}) {
                id
                totalSupply
                timestamp
                token0 {
                    name
                    symbol
                    decimals
                    id
                }
                token1 {
                    name
                    symbol
                    decimals
                    id
                }
            }
        }
    `;

    try {
        const data = await request<PairTokenQueryResponse>(INFO_CLIENT, query)
        return data.pairs.map((pair) => {
            return {
                name: `${pair.token0.symbol} - ${pair.token1.symbol}`,
                address: pair.id,
                totalSupply: new BigNumber(pair.totalSupply).multipliedBy(BIG_TEN.pow(18)),
                decimals: 18,
                timestamp: parseInt(pair.timestamp),
                token0: new Token(
                    ChainId.CRONOS, 
                    pair.token0.id, 
                    parseInt(pair.token0.decimals),
                    pair.token0.symbol,
                    pair.token0.name),
                token1: new Token(
                    ChainId.CRONOS, 
                    pair.token1.id, 
                    parseInt(pair.token1.decimals),
                    pair.token1.symbol,
                    pair.token1.name),
            }
        });
    } catch (error) {
        console.error('Failed to fetch pool data', error)
        return undefined;
    }
}