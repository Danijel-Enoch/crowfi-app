import { createReducer } from '@reduxjs/toolkit'
import { ProfileAccessTokenData } from 'state/types'
import {
  updateProfileAccessTokenData, 
  updateProfile,
  updateProfileComplete,
  ProfilePublicData,
} from './actions'

export interface ProfileState {
  tokenData?: ProfileAccessTokenData
  profile: ProfilePublicData
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: ProfileState = {
  profile: {

  }
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProfileAccessTokenData, (state, action) => {
      state.tokenData = action.payload.tokenData
    })
    .addCase(updateProfileComplete, (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload.profile
      }
    })
    .addCase(updateProfile, (state, action) => {
      const data:ProfilePublicData = {}
      if (action.payload.profile.name) {
        data.name = action.payload.profile.name
      }
      if (action.payload.profile.address) {
        data.address = action.payload.profile.address
      }
      if (action.payload.profile.banner) {
        data.banner = action.payload.profile.banner
      }
      if (action.payload.profile.createdAt) {
        data.portfolio = action.payload.profile.portfolio
        data.createdAt = action.payload.profile.createdAt
      }
      state.profile = {
        ...state.profile,
        ...data
      }
    })
)
