import { API_PROFILE } from 'config/constants/endpoints'
import React, { useCallback, useEffect, useState } from 'react'
import { useProfileTokenData } from 'state/profile/hooks'
import { NFTsAPIResponse, UserResponse } from './types'

export const useUpdateProfile = () => {
    const [tokenData] = useProfileTokenData()
    const handleUpdatePortfolio = useCallback(async(file: File) => {
        const formData = new FormData()
        formData.append('image', file, file.name)
        const response = await fetch(`${API_PROFILE}/me/portfolio`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.accessToken}`
          },
          body: formData,
        })

        if (response.ok) {
            const data = await response.json()
            return data?.user?.portfolio
        }

        throw new Error('Failed to upload')
    }, [tokenData])

    const handleUpdateBanner = useCallback(async(file: File) => {
        const formData = new FormData()
        formData.append('image', file, file.name)
        const response = await fetch(`${API_PROFILE}/me/banner`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.accessToken}`
          },
          body: formData,
        })

        if (response.ok) {
            const data = await response.json()
            return data?.user?.banner
        }

        throw new Error('Failed to upload')
    }, [tokenData])

    return {
        onUpdatePortfolio: handleUpdatePortfolio,
        onUpdateBanner: handleUpdateBanner
    }
}


export const useFetchUserNfts = (account?: string) => {

  const handleFetchNftsCollected = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/users/${account}/nfts/collected`, {
      method: 'GET',
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [account])

  const handleFetchNftsCreated = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/users/${account}/nfts/created`, {
      method: 'GET',
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [account])

  const handleFetchNftsOnSale = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/users/${account}/nfts/on-sale`, {
      method: 'GET',
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [account])

  return {
      onFetchNftsCollected: handleFetchNftsCollected,
      onFetchNftsCreated: handleFetchNftsCreated,
      onFetchNftsOnSale: handleFetchNftsOnSale
  }
}

export const fetchUserProfile = async (account: string) => {

  const response = await fetch(`${API_PROFILE}/users/${account}`, {
    method: 'GET'
  })

  if (response.ok) {
      const {user} = await response.json()
      return user as UserResponse
  }

  return undefined

}