import { getCrowpadSaleContract, getCrowpadSaleFactoryContract } from "utils/contractHelpers";
import crowpadSaleABI from 'config/abi/crowpadSale.json'
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";
import { PublicSaleData, PublicSaleMetaData } from "../types";

export const findSales = async (token: string) : Promise<PublicSaleData[]> => {
    const saleFactoryContract = getCrowpadSaleFactoryContract()
    const saleAddresses: string[]|null = await saleFactoryContract.getSalesForToken(0, 100)
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'openingTime', 'closingTime', 'finalized', 'logo']

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
        const chunk = Math.floor(index / 11)
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
            openingTime: new BigNumber(item[7]._hex).toNumber(),
            closingTime: new BigNumber(item[8]._hex).toNumber(),
            finalized: item[9],
            logo: item[10],
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
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'openingTime', 'closingTime', 'finalized', 'logo']

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
        const chunk = Math.floor(index / 11)
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
            openingTime: new BigNumber(item[7]._hex).toNumber(),
            closingTime: new BigNumber(item[8]._hex).toNumber(),
            finalized: item[9],
            logo: item[10],
        }
    })

    return res
}

export const getUserSales = async (account: string) : Promise<PublicSaleData[]> => {
    const saleFactoryContract = getCrowpadSaleFactoryContract()
    const saleAddresses: string[] = await saleFactoryContract.getSalesForUser(account)
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'openingTime', 'closingTime', 'finalized', 'logo']

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
        const chunk = Math.floor(index / 11)
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
            openingTime: new BigNumber(item[7]._hex).toNumber(),
            closingTime: new BigNumber(item[8]._hex).toNumber(),
            finalized: item[9],
            logo: item[10],
        }
    })

    return res
}

export const getSaleUserContribution = async (address?: string, account?: string) : Promise<BigNumber|null> => {
    if (!address || !account) {
        return null
    }

    const contract = getCrowpadSaleContract(address)
    const contribution_ = await contract.getUserContribution(account)
    return new BigNumber(contribution_._hex)
}

export const getSale = async (address: string) : Promise<PublicSaleData> => {
    const fields = ['owner', 'token', 'wallet', 'weiRaised', 'goal', 'cap', 'rate', 'openingTime', 'closingTime', 'finalized', 'logo']

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
        [openingTime_],
        [closingTime_],
        [finalized],
        [logo]
    ] = await multicall(crowpadSaleABI, calls)
    return {
        address,
        owner,
        token,
        wallet,
        weiRaised: new BigNumber(weiRaised_._hex),
        goal: new BigNumber(goal_._hex),
        cap: new BigNumber(cap_._hex),
        rate: new BigNumber(rate_._hex),
        openingTime: new BigNumber(openingTime_._hex).toNumber(),
        closingTime: new BigNumber(closingTime_._hex).toNumber(),
        finalized,
        logo
    }
}

export const getSaleMeta = async (address: string) : Promise<PublicSaleMetaData & {logo: string}> => {
    const fields = ['logo', 'website', 'facebook', 'twitter', 'instagram', 'telegram', 'github', 'discord', 'reddit', 'projectDescription']

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
        [facebook],
        [twitter], 
        [instagram],
        [telegram],
        [github],
        [discord],
        [reddit],
        [description],
    ] = await multicall(crowpadSaleABI, calls)
    return {
        logo,
        website,
        facebook,
        twitter,
        instagram,
        telegram,
        github,
        discord,
        reddit,
        description,
    }
}

