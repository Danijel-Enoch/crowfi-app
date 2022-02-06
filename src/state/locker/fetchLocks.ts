import BigNumber from 'bignumber.js'
import crowLockABI from 'config/abi/crowLock.json'
import { parse } from 'path'
import { LockType, SerializedLock } from 'state/types'
import { getLockerAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'

export const fetchLocksForuser = async (account: string, count: number, isLP: boolean): Promise<SerializedLock[]> => {

    const method = isLP ? 'lpLockForUserAtIndex' : 'normalLockForUserAtIndex'
    const lockerAddress = getLockerAddress()
    const calls = [];
    for (let i = 0; i < count; i ++) {
        calls.push({
            address:lockerAddress,
            name: method,
            params: [account, i]
        })
    }

    const rawLocks = await multicall(crowLockABI, calls)

    const parsedLocks = rawLocks.map(([rawLock]) =>  {
        return {
            type: isLP ? LockType.LIQUIDITY : LockType.NORMAL,
            id: new BigNumber(rawLock.id?._hex).toNumber().toString(),
            tokenAddress: rawLock.token,
            owner: rawLock.owner,
            amount: new BigNumber(rawLock.amount?._hex),
            lockDate: new BigNumber(rawLock.lockDate?._hex).toNumber(),
            unlockDate: new BigNumber(rawLock.unlockDate?._hex).toNumber()
        }
    })

    return parsedLocks
}