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
      state.profile.name = action.payload.profile.name
      state.profile.address = action.payload.profile.address
      state.profile.banner = action.payload.profile.banner
      state.profile.portfolio = action.payload.profile.portfolio
      state.profile.createdAt = action.payload.profile.createdAt
    })
    .addCase(updateProfile, (state, action) => {
      if (action.payload.profile.name) {
        state.profile.name = action.payload.profile.name
      }
      if (action.payload.profile.address) {
        state.profile.address = action.payload.profile.address
      }
      if (action.payload.profile.banner) {
        state.profile.banner = action.payload.profile.banner
      }
      if (action.payload.profile.createdAt) {
        state.profile.portfolio = action.payload.profile.portfolio
        state.profile.createdAt = action.payload.profile.createdAt
      }
    })
)
