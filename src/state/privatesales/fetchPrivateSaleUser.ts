import BigNumber from 'bignumber.js'
import presaleABI from 'config/abi/presale.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { SerializedPrivateSaleConfig } from 'config/constants/types'

export const fetchPrivateSaleTempTokenUserAllowances = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)

    return { address: sale.tempToken.address, name: 'allowance', params: [account, contractAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedAllowances
}


export const fetchPrivateSaleQuoteTokenUserAllowances = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)

    return { address: sale.quoteToken.address, name: 'allowance', params: [account, contractAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedAllowances
}

export const fetchPrivateSaleTempUserAllowances = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)

    return { address: sale.tempToken.address, name: 'allowance', params: [account, contractAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchPrivateSaleUserTally = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)
    return {
      address: contractAddress,
      name: 'userTokenTally',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(presaleABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchPrivateSaleUserClaimed = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)
    return {
      address: contractAddress,
      name: 'userTokenClaimed',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(presaleABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchPrivateSaleUserClaimable = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)
    return {
      address: contractAddress,
      name: 'claimableAmount',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(presaleABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    // return new BigNumber(1e18).toJSON()
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchPrivateSaleUserWhitelisted = async (account: string, salesToFetch: SerializedPrivateSaleConfig[]) => {
  const calls = salesToFetch.map((sale) => {
    const contractAddress = getAddress(sale.manager)
    return {
      address: contractAddress,
      name: 'whitelist',
      params: [account],
    }
  })

  const whiteLists = await multicall(presaleABI, calls)
  // const parsedwhitelists = whiteLists.map((whitelist) => {
  //   // return new BigNumber(1e18).toJSON()
  //   return whitelist
  // })
  return whiteLists
}