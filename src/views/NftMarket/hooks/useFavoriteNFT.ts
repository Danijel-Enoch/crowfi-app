import { useCallback } from "react"
import { API_PROFILE } from 'config/constants/endpoints'
import { useProfileTokenData } from "state/profile/hooks"

interface LikeResponse {
    likes: number,
    liked: boolean
}

export const useFavoriteNFT = (address, tokenId) => {
    const [tokenData] = useProfileTokenData()
    const handleLike = useCallback(async(
    ) => {

        const response = await fetch(`${API_PROFILE}/nfts/${address}/${tokenId}/like`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.accessToken}`
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data as LikeResponse
        }

        const error = await response.json()
        throw new Error(error?.message)
        
    }, [tokenData, address, tokenId])

    const handleDislike = useCallback(async(
    ) => {

        const response = await fetch(`${API_PROFILE}/nfts/${address}/${tokenId}/dislike`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.accessToken}`
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data as LikeResponse
        }

        const error = await response.json()
        throw new Error(error?.message)
        
    }, [tokenData, address, tokenId])
  
    return { onFavoriteNFT: handleLike, onUnfavoriteNFT: handleDislike }
  }
  
  