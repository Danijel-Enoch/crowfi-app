import salesConfig from 'config/constants/privatesales'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedTokenData, SerializedTokenFactoryState } from 'state/types'
import { fetchTokenFactoryPublicData, fetchTokenFactoryUserData, PublicTokenData, PublicTokenFactoryData } from './fetchTokenFactory'
import { fetchLPGeneratorTokens, fetchStandardTokens } from './fetchTokens'

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

export const fetchTokenFactoryUserDataAsync = createAsyncThunk<SerializedTokenData[], {
  account: string
}>(
    'tokenFactory/fetchTokenFactoryUserDataAsync',
async ({account}) => {
    const data = await fetchTokenFactoryUserData(account)
    const standardTokens = data.filter((item) => item.type === 0)
    const lpGeneratorTokens = data.filter((item) => item.type === 1)
    const standardTokenDatas = await (await fetchStandardTokens(account, standardTokens.map((item) => item.address))).map((token) => {
      return {
        ...token,
        type: 0
      }
    })

    const lpGeneratorTokenDatas = await (await fetchLPGeneratorTokens(account, lpGeneratorTokens.map((item) => item.address))).map((token) => {
      return {
        ...token,
        type: 1
      }
    })

    console.log('here', standardTokenDatas, lpGeneratorTokenDatas)

    return [...standardTokenDatas, ...lpGeneratorTokenDatas]
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