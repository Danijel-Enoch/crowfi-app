import { createAction } from '@reduxjs/toolkit'
import { ProfileAccessTokenData } from 'state/types'

export interface ProfilePublicData {
    address?: string
    name?: string
    banner?: string
    portfolio?: string
    createdAt?: string
}

export const updateProfileAccessTokenData = createAction<{ tokenData: ProfileAccessTokenData }>('profile/updateProfileAccessToken')
export const updateProfileComplete = createAction<{profile: ProfilePublicData}>('profile/updateProfileComplete')
export const updateProfile = createAction<{profile: ProfilePublicData}>('profile/updateProfile')