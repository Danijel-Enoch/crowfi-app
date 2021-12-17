import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { privatesalesConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { deserializeToken } from 'state/user/hooks/helpers'
import { PrivateSaleType } from 'config/constants/types'
import { fetchPrivateSalesPublicDataAsync, fetchPrivateSalesUserDataAsync } from '.'
import { State, SerializedPrivateSale, DeserializedPrivateSaleUserData, DeserializedPrivateSale, DeserializedPrivateSalesState } from '../types'

const deserializePrivateSaleUserData = (sale: SerializedPrivateSale): DeserializedPrivateSaleUserData => {
  return {
    tempAllowance: sale.userData ? new BigNumber(sale.userData.tempAllowance) : BIG_ZERO,
    quoteAllowance: sale.userData ? new BigNumber(sale.userData.quoteAllowance) : BIG_ZERO,
    purchasedBalance: sale.userData ? new BigNumber(sale.userData.purchasedBalance) : BIG_ZERO,
    claimableBalance: sale.userData ? new BigNumber(sale.userData.claimableBalance) : BIG_ZERO,
    claimedBalance: sale.userData ? new BigNumber(sale.userData.claimedBalance) : BIG_ZERO,
    whitelisted: sale.userData ? sale.userData.whitelisted : false
  }
}

const deserializePrivateSale = (privatesale: SerializedPrivateSale): DeserializedPrivateSale => {
  const { type, manager, price, name, desc, startDate, endDate, claimStartDate, claimEndDate, claimDays, claimPercents, whitelistEnabled } = privatesale

  return {
    type,
    manager,
    tempToken: deserializeToken(privatesale.tempToken),
    quoteToken: deserializeToken(privatesale.quoteToken),
    price,
    name,
    desc,
    startDate: startDate? new Date(startDate * 1000) : undefined,
    endDate: endDate? new Date(endDate * 1000) : undefined,
    claimStartDate: claimStartDate ? new Date(claimStartDate * 1000) : undefined,
    claimEndDate: claimEndDate ? new Date(claimEndDate * 1000) : undefined,
    startBlock: privatesale.startBlock ? new BigNumber(privatesale.startBlock) : BIG_ZERO,
    endBlock: privatesale.endBlock ? new BigNumber(privatesale.endBlock) : BIG_ZERO,
    claimStartBlock: privatesale.claimStartBlock ? new BigNumber(privatesale.claimStartBlock) : BIG_ZERO,
    claimEndBlock: privatesale.claimEndBlock ? new BigNumber(privatesale.claimEndBlock) : BIG_ZERO,
    claimDays,
    claimPercents,
    userData: deserializePrivateSaleUserData(privatesale),
    whitelistEnabled
  }
}

export const usePollPrivateSalesPublicData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const types = privatesalesConfig.map((saleToFetch) => saleToFetch.type)

    dispatch(fetchPrivateSalesPublicDataAsync(types))
  }, [dispatch, slowRefresh])
}

export const usePollPrivateSalesWithUserData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()
  useEffect(() => {
    const types = privatesalesConfig.map((saleToFetch) => saleToFetch.type)

    dispatch(fetchPrivateSalesPublicDataAsync(types))

    if (account) {
      dispatch(fetchPrivateSalesUserDataAsync({ account, types }))
    }
  }, [dispatch, slowRefresh, account])
}

export const usePrivateSales = (): DeserializedPrivateSalesState => {
  const sales = useSelector((state: State) => state.privatesales)
  const deserializedPrivateSalesData = sales.data.map(deserializePrivateSale)
  const { loadArchivedData, userDataLoaded } = sales
  return {
    loadArchivedData,
    userDataLoaded,
    data: deserializedPrivateSalesData,
  }
}

export const usePrivateSaleFromType = (type: PrivateSaleType): DeserializedPrivateSale => {
  const sale = useSelector((state: State) => state.privatesales.data.find((f) => f.type === type))
  return deserializePrivateSale(sale)
}

export const usePrivateSaleUser = (type): DeserializedPrivateSaleUserData => {
  const { userData } = usePrivateSaleFromType(type)
  const { tempAllowance, quoteAllowance, purchasedBalance, claimedBalance, claimableBalance, whitelisted } = userData
  return {
    tempAllowance, quoteAllowance, purchasedBalance, claimedBalance, claimableBalance, whitelisted
  }
}
