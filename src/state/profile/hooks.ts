import { useCallback, useEffect, useMemo } from 'react'
import { Pair, Token } from '@pancakeswap/sdk'
import { useWeb3React } from '@web3-react/core'
import { useDispatch, useSelector } from 'react-redux'
import { ProfileAccessTokenData, ProfileLoginStatus } from 'state/types'
import { AppDispatch, AppState } from '../index'
import {
  updateProfileAccessTokenData,
  updateProfile,
  ProfilePublicData
} from './actions'

export function useProfile(): ProfilePublicData {
  return  useSelector<AppState, AppState['profile']['profile']>((state) => {
    return state.profile?.profile
  })
}

export function useProfileAddress(): [string, (address: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const profileAddress = useSelector<AppState, AppState['profile']['profile']['address']>((state) => {
    return state.profile?.profile?.address
  })

  const setProfileAddress = useCallback(
    (address: string) => {
      dispatch(updateProfile({profile: {address}}))
    },
    [dispatch],
  )
  return [profileAddress, setProfileAddress]
}

export function useProfileName(): [string, (accessToken: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const profileName = useSelector<AppState, AppState['profile']['profile']['name']>((state) => {
    return state.profile?.profile?.name
  })

  const setName = useCallback(
    (name: string) => {
      dispatch(updateProfile({profile: {name}}))
    },
    [dispatch],
  )
  return [profileName, setName]
}

export function useProfileTokenData(): [ProfileAccessTokenData, (data: ProfileAccessTokenData) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const profileTokenData = useSelector<AppState, AppState['profile']['tokenData']>((state) => {
    return state.profile.tokenData
  })

  const setAccessToken = useCallback(
    (tokenData: ProfileAccessTokenData) => {
      dispatch(updateProfileAccessTokenData({tokenData}))
    },
    [dispatch],
  )
  return [profileTokenData, setAccessToken]
}

export const useProfileLoggedIn = () => {
  const {account} = useWeb3React()
  const [tokenData] = useProfileTokenData()
  const [profileAddress] = useProfileAddress()

  const status = useMemo(() => {
    if (!account) {
      return ProfileLoginStatus.NOT_CONNECTED
    }

    if (!tokenData) {
      return ProfileLoginStatus.NOT_LOGGEDIN
    }

    if (!profileAddress) {
      return ProfileLoginStatus.NOT_LOGGEDIN
    }

    if (profileAddress.toLowerCase() !== account.toLowerCase()) {
      return ProfileLoginStatus.NOT_LOGGEDIN
    }

    if (tokenData.expiresAt < new Date().getTime() / 1000) {
      return ProfileLoginStatus.EXPIRED
    }

    return ProfileLoginStatus.LOGGEDIN
  }, [account, tokenData, profileAddress])
  return status
}
