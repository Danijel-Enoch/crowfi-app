import { API_PROFILE } from 'config/constants/endpoints'
import React, { useCallback, useEffect, useState } from 'react'
import { useProfileTokenData } from 'state/profile/hooks'

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