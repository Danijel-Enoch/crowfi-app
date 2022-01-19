import BigNumber from 'bignumber.js'
import SimpleTokenFactoryABI from 'config/abi/crowpadTokenSimpleFactory.json'
import tokenFactoryABI from 'config/abi/crowpadTokenFactory.json'
import { getSimpleTokenFactoryAddress, getTokenFactoryAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

export interface PublicTokenFactoryData {
    lockTime: number
    deployFee: SerializedBigNumber
    lpDeployFee: SerializedBigNumber
}

export const fetchTokenFactoryPublicData = async (): Promise<PublicTokenFactoryData> => {
    const tokenFactoryAddress = getSimpleTokenFactoryAddress()

    const calls = [
        {
          address: tokenFactoryAddress,
          name: '_lockTime',
          params: [],
        },
        {
          address: tokenFactoryAddress,
          name: 'deployFee',
          params: [],
        },
    ]

    const [
        _lockTime, 
        _deployFee,
    ] = await multicall(SimpleTokenFactoryABI, calls)

    const lpTokenFactoryAddress = getTokenFactoryAddress()

    const calls2 = [
        {
          address: lpTokenFactoryAddress,
          name: 'deployFee',
          params: [],
        },
    ]

    const [
        _lpDeployFee,
    ] = await multicall(tokenFactoryABI, calls2)

    const lockTime = new BigNumber(_lockTime).toNumber()
    const deployFee = new BigNumber(_deployFee).toJSON()
    const lpDeployFee = new BigNumber(_lpDeployFee).toJSON()

    return {
        lockTime,
        deployFee,
        lpDeployFee
    }
}