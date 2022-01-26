import BigNumber from "bignumber.js";
import { DeserializedLock, LockType } from "state/types";
import { getLockerAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";
import crowLockABI from 'config/abi/crowLock.json'
import { getLockerContract } from "utils/contractHelpers";

function parseMulticallResponse(rawLocks) {
    return rawLocks.map(([rawLock]) =>  {
        return {
            type: LockType.UNKNOWN,
            id: new BigNumber(rawLock.id?._hex).toNumber().toString(),
            tokenAddress: rawLock.token,
            owner: rawLock.owner,
            amount: new BigNumber(rawLock.amount?._hex),
            lockDate: new BigNumber(rawLock.lockDate?._hex).toNumber(),
            unlockDate: new BigNumber(rawLock.unlockDate?._hex).toNumber()
        }
    })
}

export const getLock = async(lockId: number): Promise<DeserializedLock|null> => {
    const lockerContract = getLockerContract()
    const rawLock = await lockerContract.getLock(lockId)
    if (rawLock) {
        return {
            type: LockType.UNKNOWN,
            id: new BigNumber(rawLock.id?._hex).toNumber().toString(),
            tokenAddress: rawLock.token,
            owner: rawLock.owner,
            amount: new BigNumber(rawLock.amount?._hex),
            lockDate: new BigNumber(rawLock.lockDate?._hex).toNumber(),
            unlockDate: new BigNumber(rawLock.unlockDate?._hex).toNumber()
        }
    }

    return null
}

export const findLocks = async (address: string) : Promise<DeserializedLock[]> => {
    const lockerContract = getLockerContract()
    const countHex = await lockerContract.totalLockCountForToken(address)
    const count = new BigNumber(countHex._hex).toNumber()
    if (count > 0) {
        const rawLocks = await lockerContract.getLocksForToken(address, 0, count -1 )
        return rawLocks.map((rawLock) =>  {
            return {
                type: LockType.UNKNOWN,
                id: new BigNumber(rawLock.id?._hex).toNumber().toString(),
                tokenAddress: rawLock.token,
                owner: rawLock.owner,
                amount: new BigNumber(rawLock.amount?._hex),
                lockDate: new BigNumber(rawLock.lockDate?._hex).toNumber(),
                unlockDate: new BigNumber(rawLock.unlockDate?._hex).toNumber()
            }
        })
    }
    return []
}

export const getLocks = async (start: number, count: number) : Promise<DeserializedLock[]> => {
    const lockerAddress = getLockerAddress()
    const calls = [];
    for (let i = start; i < (start + count); i ++) {
        calls.push({
            address:lockerAddress,
            name: 'getLock',
            params: [i]
        })
    }

    const rawLocks = await multicall(crowLockABI, calls)
    const parsedLocks = parseMulticallResponse(rawLocks)

    return parsedLocks
}

export const getMyLocks = async (account: string, isLP: boolean, start: number, count: number) : Promise<DeserializedLock[]> => {
    const method = isLP ? 'lpLockForUserAtIndex' : 'normalLockForUserAtIndex'
    const lockerAddress = getLockerAddress()
    const calls = [];
    for (let i = start; i < (start + count); i ++) {
        calls.push({
            address:lockerAddress,
            name: method,
            params: [account, i]
        })
    }

    const rawLocks = await multicall(crowLockABI, calls)
    const parsedLocks = parseMulticallResponse(rawLocks)

    return parsedLocks
}