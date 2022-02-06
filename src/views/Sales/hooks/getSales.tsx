import { getCrowpadSaleContract, getCrowpadSaleFactoryContract } from "utils/contractHelpers";
import { AddressZero } from '@ethersproject/constants'
import crowpadSaleABI from 'config/abi/crowpadSale.json'
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { PaymentType, PublicSaleData, PublicSaleMetaData } from "../types";

export const findSales = async (token: string) : Promise<PublicSaleData[]> => {
    const saleFactoryContract = getCrowpadSaleFactoryContract()
    const saleAddresses: string[]|null = await saleFactoryContract.getSalesForToken(0, 100)
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'rateDecimals', 'listingRate', 'listingRateDecimals', 'liquidityPercent', 'openingTime', 'closingTime', 'finalized', 'logo', 'canceled', 'baseToken']

    if (!saleAddresses || saleAddresses.length === 0) {
        return [];
    }

    const calls = saleAddresses.reduce((accum, address, index) => {
        fields.forEach((field) => {
            accum.push({
                address,
                name: field,
                params: []
            })
        });
        return accum
    }, [])

    const response = await multicall(crowpadSaleABI, calls)
    const res = response.reduce((accum: any[][], item, index) => {
        const chunk = Math.floor(index / 17)
        const chunks = accum
        chunks[chunk] = ([] as any[]).concat(accum[chunk] || [], item)
        return chunks
    }, []).map((item, index) => {
        return {
            address: saleAddresses[index],
            owner: item[0],
            token: item[1],
            wallet: item[2],
            weiRaised: new BigNumber(item[3]._hex),
            goal: new BigNumber(item[4]._hex),
            cap: new BigNumber(item[5]._hex),
            rate: new BigNumber(item[6]._hex),
            rateDecimals: new BigNumber(item[7]._hex).toNumber(),
            listingRate: new BigNumber(item[8]._hex),
            listingRateDecimals: new BigNumber(item[9]._hex).toNumber(),
            liquidity: new BigNumber(item[10]._hex).toNumber(),
            openingTime: new BigNumber(item[11]._hex).toNumber(),
            closingTime: new BigNumber(item[12]._hex).toNumber(),
            finalized: item[13],
            logo: item[14],
            canceled: item[15],
            baseToken: item[16],
            useETH: item[16] === AddressZero,
        }
    })

    return res
}

export const getSales = async (start: number, count: number) : Promise<PublicSaleData[]> => {
    if (count === 0) {
        return [];
    }

    const saleFactoryContract = getCrowpadSaleFactoryContract()
    const saleAddresses: string[] = await saleFactoryContract.getSales(start, start+count)
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'rateDecimals', 'listingRate', 'listingRateDecimals', 'liquidityPercent', 'openingTime', 'closingTime', 'finalized', 'logo', 'canceled', 'baseToken']

    const calls = saleAddresses.reduce((accum, address, index) => {
        fields.forEach((field) => {
            accum.push({
                address,
                name: field,
                params: []
            })
        });
        return accum
    }, [])

    const response = await multicall(crowpadSaleABI, calls)
    const res = response.reduce((accum: any[][], item, index) => {
        const chunk = Math.floor(index / 17)
        const chunks = accum
        chunks[chunk] = ([] as any[]).concat(accum[chunk] || [], item)
        return chunks
    }, []).map((item, index) => {
        return {
            address: saleAddresses[index],
            owner: item[0],
            token: item[1],
            wallet: item[2],
            weiRaised: new BigNumber(item[3]._hex),
            goal: new BigNumber(item[4]._hex),
            cap: new BigNumber(item[5]._hex),
            rate: new BigNumber(item[6]._hex),
            rateDecimals: new BigNumber(item[7]._hex).toNumber(),
            listingRate: new BigNumber(item[8]._hex),
            listingRateDecimals: new BigNumber(item[9]._hex).toNumber(),
            liquidity: new BigNumber(item[10]._hex).toNumber(),
            openingTime: new BigNumber(item[11]._hex).toNumber(),
            closingTime: new BigNumber(item[12]._hex).toNumber(),
            finalized: item[13],
            logo: item[14],
            canceled: item[15],
            baseToken: item[16],
            useETH: item[16] === AddressZero,
        }
    })

    return res
}

export const getUserSales = async (account: string) : Promise<PublicSaleData[]> => {
    const saleFactoryContract = getCrowpadSaleFactoryContract()
    const saleAddresses: string[] = await saleFactoryContract.getSalesForUser(account)
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'rateDecimals', 'listingRate', 'listingRateDecimals', 'liquidityPercent', 'openingTime', 'closingTime', 'finalized', 'logo', 'canceled', 'baseToken']

    if (!saleAddresses || saleAddresses.length === 0) {
        return [];
    }

    const calls = saleAddresses.reduce((accum, address, index) => {
        fields.forEach((field) => {
            accum.push({
                address,
                name: field,
                params: []
            })
        });
        return accum
    }, [])

    const response = await multicall(crowpadSaleABI, calls)
    const res = response.reduce((accum: any[][], item, index) => {
        const chunk = Math.floor(index / 17)
        const chunks = accum
        chunks[chunk] = ([] as any[]).concat(accum[chunk] || [], item)
        return chunks
    }, []).map((item, index) => {
        return {
            address: saleAddresses[index],
            owner: item[0],
            token: item[1],
            wallet: item[2],
            weiRaised: new BigNumber(item[3]._hex),
            goal: new BigNumber(item[4]._hex),
            cap: new BigNumber(item[5]._hex),
            rate: new BigNumber(item[6]._hex),
            rateDecimals: new BigNumber(item[7]._hex).toNumber(),
            listingRate: new BigNumber(item[8]._hex),
            listingRateDecimals: new BigNumber(item[9]._hex).toNumber(),
            liquidity: new BigNumber(item[10]._hex).toNumber(),
            openingTime: new BigNumber(item[11]._hex).toNumber(),
            closingTime: new BigNumber(item[12]._hex).toNumber(),
            finalized: item[13],
            logo: item[14],
            canceled: item[15],
            baseToken: item[16],
            useETH: item[16] === AddressZero,
        }
    })

    return res
}

export const getSaleUserData = async (address?: string, account?: string) : Promise<{contribution: BigNumber, balanceEth: BigNumber, balance: BigNumber, whitelisted: boolean}> => {
    if (!address || !account) {
        return {contribution: null, balanceEth: null, balance: null, whitelisted: false}
    }
    
    const calls = [
        {
            address,
            name: 'getUserContribution',
            params: [account]
        },
        {
            address,
            name: 'depositOf',
            params: [account]
        },
        {
            address,
            name: 'balanceOf',
            params: [account]
        },
        {
            address,
            name: 'isWhitelisted',
            params: [account]
        }
    ]

    const [
        [contribution_], 
        [deposit_],
        [balance_],
        [whitelisted]
    ] = await multicall(crowpadSaleABI, calls)
    
    const contribution = contribution_ ? new BigNumber(contribution_._hex) : BIG_ZERO;
    const balanceEth = deposit_ ? new BigNumber(deposit_._hex) : BIG_ZERO;
    const balance = balance_ ? new BigNumber(balance_._hex) : BIG_ZERO;
    return {contribution, balanceEth, balance, whitelisted}
}

export const getSale = async (address: string) : Promise<PublicSaleData> => {
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'rateDecimals', 'listingRate', 'listingRateDecimals', 'liquidityPercent', 'openingTime', 'closingTime', 'finalized', 'logo', 'investorMinCap', 'investorHardCap', 'whitelistEnabled', 'canceled', 'liquidityUnlockTime', 'lockId', 'baseToken']

    const calls = fields.map((field) =>  {
        return {
            address,
            name: field,
            params: []
        }
    })

    const [
        [owner], 
        [token], 
        [wallet],
        [weiRaised_], 
        [goal_],
        [cap_],
        [rate_],
        [rateDecimals_],
        [listingRate_],
        [listingRateDecimals_],
        [liquidityPercent_],
        [openingTime_],
        [closingTime_],
        [finalized],
        [logo],
        [minContribution_],
        [maxContribution_],
        [whitelistEnabled],
        [canceled],
        [liquidityUnlockTime_],
        [lockId_],
        [baseToken]
    ] = await multicall(crowpadSaleABI, calls)
    return {
        address,
        owner,
        token,
        useETH: baseToken === AddressZero,
        baseToken,
        wallet,
        weiRaised: new BigNumber(weiRaised_._hex),
        goal: new BigNumber(goal_._hex),
        cap: new BigNumber(cap_._hex),
        rate: new BigNumber(rate_._hex),
        rateDecimals: new BigNumber(rateDecimals_._hex).toNumber(),
        listingRate: new BigNumber(listingRate_._hex),
        listingRateDecimals: new BigNumber(listingRateDecimals_._hex).toNumber(),
        liquidity: new BigNumber(liquidityPercent_._hex).toNumber(),
        openingTime: new BigNumber(openingTime_._hex).toNumber(),
        closingTime: new BigNumber(closingTime_._hex).toNumber(),
        finalized,
        canceled,
        logo,
        minContribution: new BigNumber(minContribution_._hex),
        maxContribution: new BigNumber(maxContribution_._hex),
        whitelistEnabled,
        paymentType:  new BigNumber(closingTime_._hex).toNumber() === 0 ? PaymentType.DIRECT : PaymentType.ESCROW,
        unlockTime: new BigNumber(liquidityUnlockTime_._hex).toNumber(),
        lockId: new BigNumber(lockId_._hex).toNumber(),
    }
}

export const getSaleMeta = async (address: string) : Promise<PublicSaleMetaData & {logo: string}> => {
    const fields = ['logo', 'website', 'links', 'projectDescription']

    const calls = fields.map((field) =>  {
        return {
            address,
            name: field,
            params: []
        }
    })

    const [
        [logo], 
        [website], 
        links,
        [description],
    ] = await multicall(crowpadSaleABI, calls)

    return {
        logo,
        website,
        facebook: links.facebook,
        twitter: links.twitter,
        instagram: links.instagram,
        telegram: links.telegram,
        discord: links.discord,
        reddit: links.reddit,
        github: links.github,
        description,
    }
}

