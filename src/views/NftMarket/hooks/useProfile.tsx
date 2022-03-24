import { API_PROFILE } from 'config/constants/endpoints'
import React, { useCallback, useEffect, useState } from 'react'
import { useProfileTokenData } from 'state/profile/hooks'
import { NFTsAPIResponse } from './types'

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


export const useFetchMyProfile = () => {
  const [tokenData] = useProfileTokenData()

  const handleFetchNftsCollected = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/me/nfts/collected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`
      }
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [tokenData])

  const handleFetchNftsCreated = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/me/nfts/created`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`
      }
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [tokenData])

  const handleFetchNftsOnSale = useCallback(async() => {
    const response = await fetch(`${API_PROFILE}/me/nfts/on-sale`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`
      }
    })

    if (response.ok) {
        const data: NFTsAPIResponse = await response.json()
        return data?.rows
    }

    return []
  }, [tokenData])

  return {
      onFetchNftsCollected: handleFetchNftsCollected,
      onFetchNftsCreated: handleFetchNftsCreated,
      onFetchNftsOnSale: handleFetchNftsOnSale
  }
}