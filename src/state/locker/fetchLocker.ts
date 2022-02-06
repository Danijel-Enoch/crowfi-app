import BigNumber from 'bignumber.js'
import crowLockABI from 'config/abi/crowLock.json'
import { getLockerAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

export interface PublicLockerUserData {
    normalLockCount: number
    lpLockCount: number
}

export interface PublicLockerData {
    totalLockCount?: number
    totalTokenLockedCount?: number
    fee?: SerializedBigNumber
}

export const fetchLockerUserData = async (account: string): Promise<PublicLockerUserData> => {

    const lockerAddress = getLockerAddress()

    const calls = [
        {
          address: lockerAddress,
          name: 'normalLockCountForUser',
          params: [account],
        },
        {
          address: lockerAddress,
          name: 'lpLockCountForUser',
          params: [account],
        },
    ];

    const [[_normalLockCount], [_lpLockCount]] = await multicall(crowLockABI, calls)
    const normalLockCount = _normalLockCount ? new BigNumber(_normalLockCount._hex).toNumber() : 0
    const lpLockCount = _lpLockCount ? new BigNumber(_lpLockCount._hex).toNumber() : 0


    
    return {
        normalLockCount,
        lpLockCount,
    }
}

export const fetchLockerPublicData = async (): Promise<PublicLockerData> => {

    const lockerAddress = getLockerAddress()

    const calls = [
        {
          address: lockerAddress,
          name: 'getTotalLockCount',
          params: [],
        },
        {
          address: lockerAddress,
          name: 'totalTokenLockedCount',
          params: [],
        },
        {
          address: lockerAddress,
          name: 'fee',
          params: [],
        },
    ];

    const [[_totalLockCount], [_totalTokenLockedCount], [_fee]] = await multicall(crowLockABI, calls)

    const totalLockCount = _totalLockCount ? new BigNumber(_totalLockCount._hex).toNumber() : 0
    const totalTokenLockedCount = _totalTokenLockedCount ? new BigNumber(_totalTokenLockedCount._hex).toNumber() : 0
    const fee = _fee ? new BigNumber(_fee._hex).toJSON() : '0'

    return {
        totalLockCount,
        totalTokenLockedCount,
        fee
    }
}