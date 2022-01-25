import BigNumber from 'bignumber.js'
import { getSimpleTokenFactoryContract, getTokenFactoryContract, getTokenFactoryManagerContract } from 'utils/contractHelpers'

export interface PublicTokenFactoryData {
    deployFee: SerializedBigNumber
    lpDeployFee: SerializedBigNumber
    totalTokens: SerializedBigNumber
}

export interface PublicTokenData {
    address: string
    type: number
}

export const fetchTokenFactoryUserData = async (account: string): Promise<PublicTokenData[]> => {

    const contract = getTokenFactoryManagerContract()

    const [tokens, types] = await contract.getAllTokens(account)

    const res = tokens.map((token, index) => {
        return {
            address: token, type: types[index]
        }
    })

    return res
}

export const fetchTokenFactoryPublicData = async (): Promise<PublicTokenFactoryData> => {


    const standardTokenFactory = getSimpleTokenFactoryContract()
    const _deployFee = await standardTokenFactory.flatFee()

    const lpTokenFactory = getTokenFactoryContract()
    const _lpDeployFee = await lpTokenFactory.flatFee()

    const tokenFactoryManagerContract = getTokenFactoryManagerContract()
    const _totalTokens = await tokenFactoryManagerContract.totalTokens()

    const deployFee = new BigNumber(_deployFee._hex).toJSON()
    const lpDeployFee = new BigNumber(_lpDeployFee._hex).toJSON()
    const totalTokens = new BigNumber(_totalTokens._hex).toJSON()

    return {
        deployFee,
        lpDeployFee,
        totalTokens,
    }
}