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

export const findTokensLocks = async (tokenAddresses: string[]) : Promise<Map<string, DeserializedLock[]>> => {
    const res: Map<string, DeserializedLock[]> = new Map<string, DeserializedLock[]>()
    tokenAddresses.forEach((address) => {
        res.set(address, [])
    })
    const lockerAddress = getLockerAddress()
    const calls = tokenAddresses.map((address) => {
        return {
            address:lockerAddress,
            name: 'totalLockCountForToken',
            params: [address]
        }
    })
    const rawLockCounts = await multicall(crowLockABI, calls)
    const secondAddreses: string[] = []
    const secondCalls: any[] = [];
    rawLockCounts.forEach((rawLockCount, index) => {
        const lockCount = parseInt(rawLockCount)
        if (lockCount > 0) {
            secondAddreses.push(tokenAddresses[index])
            secondCalls.push({
                address:lockerAddress,
                name: 'getLocksForToken',
                params: [tokenAddresses[index], 0, lockCount - 1]
            })
        }
    })
    const rawLocksArray = await multicall(crowLockABI, secondCalls)
    rawLocksArray.forEach((rawLocks, index) => {
        
        const parsedLocks = parseMulticallResponse(rawLocks)
        res.set(secondAddreses[index], parsedLocks)
    })
    
    return res
}