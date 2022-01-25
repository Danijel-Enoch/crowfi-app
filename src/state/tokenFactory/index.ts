import salesConfig from 'config/constants/privatesales'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedTokenFactoryState, TokenFactoryToken } from 'state/types'
import { fetchTokenFactoryPublicData, fetchTokenFactoryUserData, PublicTokenData, PublicTokenFactoryData } from './fetchTokenFactory'
import { fetchStandardTokens } from './fetchTokens'

  
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

export const fetchTokenFactoryUserDataAsync = createAsyncThunk<TokenFactoryToken[], {
  account: string
}>(
    'tokenFactory/fetchTokenFactoryUserDataAsync',
async ({account}) => {
    const data = await fetchTokenFactoryUserData(account)
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
        state.totalTokens = action.payload.totalTokens
        state.deployFee = action.payload.deployFee
        state.lpDeployFee = action.payload.lpDeployFee
      })

      builder.addCase(fetchTokenFactoryUserDataAsync.fulfilled, (state, action) => {
        state.userTokens = action.payload
      })
    },
  })
  
  // Actions
  
  export default tokenFactorySlices.reducer