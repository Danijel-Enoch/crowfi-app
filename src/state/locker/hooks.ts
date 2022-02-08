import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useRefresh from 'hooks/useRefresh'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { DeserializedLock, State } from '../types'
import { fetchLockerUserDataAsync, fetchLockerPublicDataAsync } from '.'


export const usePollLockerData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    dispatch(fetchLockerPublicDataAsync())
    if (account) {
      dispatch(fetchLockerUserDataAsync({account}))
    }
  }, [dispatch, slowRefresh, account])
}

export const useMyNormalLocks = () : DeserializedLock[] => {
  const serializedLocks =  useSelector((state: State) => state.locker.userData?.normalLocks)
  return serializedLocks ? serializedLocks.map((lock) => {
    const {type, id, tokenAddress, owner, amount, lockDate, unlockDate} = lock
    return {
      type,
      id,
      tokenAddress,
      owner,
      amount: new BigNumber(amount),
      lockDate,
      unlockDate
    }
  }) : []
}

export const useMyLPLocks = () : DeserializedLock[] => {
  const serializedLocks =  useSelector((state: State) => state.locker.userData?.lpLocks)

  return serializedLocks ? serializedLocks.map((lock) => {
    const {type, id, tokenAddress, owner, amount, lockDate, unlockDate} = lock
    return {
      type,
      id,
      tokenAddress,
      owner,
      amount: new BigNumber(amount),
      lockDate,
      unlockDate
    }
  }) : []
}

export const useTotalLockCount = () =>  {
  return useSelector((state: State) => state.locker.toalLockCount)
}
export const useMyNormalLockCount = () =>  {
  return useSelector((state: State) => state.locker.userData?.normalLockCount)
}
export const useMyLiquidityLockCount = () =>  {
  return useSelector((state: State) => state.locker.userData?.lpLockCount)
}

export const useLockerUserDataLoaded = () =>  {
  return useSelector((state: State) => state.locker.userDataLoaded)
}

export const useLockerFee = () =>  {
  return useSelector((state: State) => state.locker.fee)
}
