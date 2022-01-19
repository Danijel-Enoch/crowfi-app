import salesConfig from 'config/constants/privatesales'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedTokenFactoryState } from 'state/types'
import { fetchTokenFactoryPublicData, PublicTokenFactoryData } from './fetchTokenFactory'

  
const initialState: SerializedTokenFactoryState = {
    userDataLoaded: false,
}


export const fetchTokenFactoryPublicDataAsync = createAsyncThunk<PublicTokenFactoryData>(
    'tokenFactory/fetchTokenFactoryPublicDataAsync',
async () => {
    const data = await fetchTokenFactoryPublicData()
    return data
},
)

export const tokenFactorySlices = createSlice({
    name: 'TokenFactory',
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
      builder.addCase(fetchTokenFactoryPublicDataAsync.fulfilled, (state, action) => {
        state.lockTime = action.payload.lockTime
        state.deployFee = action.payload.deployFee
        state.lpDeployFee = action.payload.lpDeployFee
      })
    },
  })
  
  // Actions
  
  export default tokenFactorySlices.reducer