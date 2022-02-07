import { AddressZero } from '@ethersproject/constants'
import BigNumber from "bignumber.js";
import { LAUNCHPAD_CLIENT } from "config/constants/endpoints";
import request, { gql } from "graphql-request"
import { PublicSaleData } from "../types";


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

interface ContributionFields {
    amount: string,
    contributor: string,
    sale: SaleFields
}

interface ContributionsQueryResponse {
    contributions: ContributionFields[]
}
  

export const getMyContributions = async (account: string) : Promise<PublicSaleData[]> => {
    if (process.env.REACT_APP_CHAIN_ID === '338') {
        return [];
    }

    const query = gql`
        query my_contributions {
            contributions: contributions(first: 100, where: {contributor_in: ["${account.toLowerCase()}"]}) {
            sale {
                id
                token {
                id
                }
                owner
                useEth
                baseToken {
                id
                }
                openingTime
                closingTime
                unlockTime
                rate
                rateDecimals
                listingRate
                listingRateDecimals
                liquidityPercent
                softCap
                hardCap
                minContribution
                maxContribution
                weiRaised
                finalized
                canceled
                deposited
                whitelistEnabled
            }
            contributor
            amount
            }
        }
    `;

    try {
        const data = await request<ContributionsQueryResponse>(LAUNCHPAD_CLIENT, query)
        return data.contributions.map((item) => {
            const sale = item.sale
            return {
                address: sale.id,
                token: sale.token.id,
                owner: sale.owner,
                useETH: sale.useEth,
                baseToken: sale.baseToken ? sale.baseToken.id : AddressZero,
                openingTime: parseInt(sale.openingTime),
                closingTime: parseInt(sale.closingTime),
                unlockTime: parseInt(sale.unlockTime),
                rate: new BigNumber(sale.rate),
                rateDecimals: new BigNumber(sale.rateDecimals).toNumber(),
                listingRate: new BigNumber(sale.listingRate),
                listingRateDecimals: new BigNumber(sale.listingRateDecimals).toNumber(),
                liquidity: parseInt(sale.liquidityPercent),
                goal: new BigNumber(sale.softCap),
                cap: new BigNumber(sale.hardCap),
                minContribution: new BigNumber(sale.minContribution),
                maxContribution: new BigNumber(sale.maxContribution),
                weiRaised: new BigNumber(sale.weiRaised),
                finalized: sale.finalized,
                canceled: sale.canceled,
                deposited: sale.deposited,
                whitelistEnabled: sale.whitelistEnabled,
            }
        });
    } catch (error) {
        console.error('Failed to fetch pool data', error)
        return undefined;
    }
}