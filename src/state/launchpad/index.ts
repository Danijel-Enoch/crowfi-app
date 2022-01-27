import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedLaunchpadState } from 'state/types'
import { fetchLaunchpadUserData, fetchLaunchpadPublicData, PublicLaunchpadData, PublicLaunchpadUserData } from './fetchLaunchpad'

const initialState: SerializedLaunchpadState = {
    userDataLoaded: false,
}


export const fetchLaunchpadPublicDataAsync = createAsyncThunk<PublicLaunchpadData>(
    'launchpad/fetchLaunchpadPublicDataAsync',
async () => {
    const data = await fetchLaunchpadPublicData()
    return data
},
)

export const fetchLaunchpadUserDataAsync = createAsyncThunk<PublicLaunchpadUserData, {
  account: string
}>(
    'launchpad/fetchLockerUserDataAsync',
async ({account}) => {
    const data = await fetchLaunchpadUserData(account)
    return data
  },
)

export const lockerSlices = createSlice({
    name: 'Locker',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
  
      // Update privatesales with user data
      builder.addCase(fetchLaunchpadPublicDataAsync.fulfilled, (state, action) => {
        state.fee = action.payload.fee
        state.totalSaleCount = action.payload.totalSaleCount
      })

      builder.addCase(fetchLaunchpadUserDataAsync.fulfilled, (state, action) => {
        state.userSaleCount = action.payload.userSaleCount
        state.userDataLoaded = true
      })
    },
  })
  
  // Actions
  
  export default lockerSlices.reducer