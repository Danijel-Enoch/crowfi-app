import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedLockerState, SerializedLockerUserData, SerializedTokenData } from 'state/types'
import { fetchLockerPublicData, fetchLockerUserData, PublicLockerData } from './fetchLocker'
import { fetchLocksForuser } from './fetchLocks'

const initialState: SerializedLockerState = {
    userDataLoaded: false,
}


export const fetchLockerPublicDataAsync = createAsyncThunk<PublicLockerData>(
    'locker/fetchLockerPublicDataAsync',
async () => {
    const data = await fetchLockerPublicData()
    return data
},
)

export const fetchLockerUserDataAsync = createAsyncThunk<SerializedLockerUserData, {
  account: string
}>(
    'locker/fetchLockerUserDataAsync',
async ({account}) => {
    const data = await fetchLockerUserData(account)

    // const normalLocks = data.normalLockCount > 0 ? await fetchLocksForuser(account, data.normalLockCount, false) : []
    // const lpLocks = data.lpLockCount > 0 ? await fetchLocksForuser(account, data.lpLockCount, true) : []

    return {
      ...data,
      // normalLocks,
      // lpLocks
    }
  },
)

export const lockerSlices = createSlice({
    name: 'Locker',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Update privatesales with live data
    //   builder.addCase(fetchPrivateSalesPublicDataAsync.fulfilled, (state, action) => {
    //     state.data = state.data.map((privatesale) => {
    //       const livePrivateSaleData = action.payload.find((privatesaleData) => privatesaleData.type === privatesale.type)
    //       return { ...privatesale, ...livePrivateSaleData }
    //     })
    //   })
  
      // Update privatesales with user data
      builder.addCase(fetchLockerPublicDataAsync.fulfilled, (state, action) => {
        state.fee = action.payload.fee
        state.toalLockCount = action.payload.totalLockCount
        state.totalTokenLockedCount = action.payload.totalTokenLockedCount
      })

      builder.addCase(fetchLockerUserDataAsync.fulfilled, (state, action) => {
        state.userData = action.payload
        state.userDataLoaded = true
      })
    },
  })
  
  // Actions
  
  export default lockerSlices.reducer