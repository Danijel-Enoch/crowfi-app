import salesConfig from 'config/constants/privatesales'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import isArchivedPid from 'utils/farmHelpers'
import { PrivateSaleType } from 'config/constants/types'
import fetchPrivateSales from './fetchPrivateSales'
import {
  fetchPrivateSaleUserTally,
  fetchPrivateSaleUserClaimed,
  fetchPrivateSaleUserClaimable,
  fetchPrivateSaleTempTokenUserAllowances,
  fetchPrivateSaleQuoteTokenUserAllowances,
  fetchPrivateSaleUserWhitelisted
} from './fetchPrivateSaleUser'

import { SerializedPrivateSalesState, SerializedPrivateSale } from '../types'

const noAccountSalesConfig = salesConfig.map((farm) => ({
    ...farm,
    userData: {
        tempAllowance: '0',
        quoteAllowance: '0',
        purchasedBalance: '0',
        claimedBalance: '0',
        claimableBalance: '0',
        whitelisted: false
    },
}))
  
const initialState: SerializedPrivateSalesState = {
    data: noAccountSalesConfig,
    loadArchivedData: false,
    userDataLoaded: false,
}


export const fetchPrivateSalesPublicDataAsync = createAsyncThunk<SerializedPrivateSale[], PrivateSaleType[]>(
    'privatesales/fetchPrivateSalesPublicDataAsync',
async (types) => {
    const salesToFetch = salesConfig.filter((privatesaleConfig) => types.includes(privatesaleConfig.type))

    const sales = await fetchPrivateSales(salesToFetch)

    return sales
},
)

interface PrivateSaleUserDataResponse {
  type: PrivateSaleType
  tempAllowance: string
  quoteAllowance: string
  purchasedBalance: string
  claimedBalance: string
  claimableBalance: string
  whitelisted: boolean
}
  
export const fetchPrivateSalesUserDataAsync = createAsyncThunk<PrivateSaleUserDataResponse[], { account: string; types: PrivateSaleType[] }>(
'privatesales/fetchPrivateSalesUserDataAsync',
async ({ account, types }) => {
    const salesToFetch = salesConfig.filter((privatesaleConfig) => types.includes(privatesaleConfig.type))
    const quoteAllowances = await fetchPrivateSaleQuoteTokenUserAllowances(account, salesToFetch);
    const tempAllowances = await fetchPrivateSaleTempTokenUserAllowances(account, salesToFetch);
    const userTally = await fetchPrivateSaleUserTally(account, salesToFetch);
    const userClaimed = await fetchPrivateSaleUserClaimed(account, salesToFetch);
    const userClaimable = await fetchPrivateSaleUserClaimable(account, salesToFetch);
    const userWhitelists = await fetchPrivateSaleUserWhitelisted(account, salesToFetch);

    return userTally.map((tally, index) => {
        return {
            type: salesToFetch[index].type,
            quoteAllowance: quoteAllowances[index],
            tempAllowance: tempAllowances[index],
            purchasedBalance: userTally[index],
            claimedBalance: userClaimed[index],
            claimableBalance: userClaimable[index],
            whitelisted: userWhitelists[index][0],
        }
    })
},
)



export const privatesalesSlice = createSlice({
    name: 'PrivateSales',
    initialState,
    reducers: {
        setLoadArchivedPrivateSalesData: (state, action) => {
        const loadArchivedData = action.payload
        state.loadArchivedData = loadArchivedData
      },
    },
    extraReducers: (builder) => {
      // Update privatesales with live data
      builder.addCase(fetchPrivateSalesPublicDataAsync.fulfilled, (state, action) => {
        state.data = state.data.map((privatesale) => {
          const livePrivateSaleData = action.payload.find((privatesaleData) => privatesaleData.type === privatesale.type)
          return { ...privatesale, ...livePrivateSaleData }
        })
      })
  
      // Update privatesales with user data
      builder.addCase(fetchPrivateSalesUserDataAsync.fulfilled, (state, action) => {
        action.payload.forEach((userDataEl) => {
          const { type } = userDataEl
          const index = state.data.findIndex((sale) => sale.type === type )
          state.data[index] = { ...state.data[index], userData: userDataEl }
        })
        state.userDataLoaded = true
      })
    },
  })
  
  // Actions
  export const { setLoadArchivedPrivateSalesData } = privatesalesSlice.actions
  
  export default privatesalesSlice.reducer