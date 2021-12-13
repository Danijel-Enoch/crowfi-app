import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import presaleABI from 'config/abi/presale.json'
import { getContractAddress } from 'ethers/lib/utils'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getContract } from 'utils/web3'
import { SerializedPrivateSale, SerializedBigNumber } from '../types'

type PublicPrivateSaleData = {
  price: number,
  startDate: number,
  endDate: number,
  startBlock: SerializedBigNumber,
  endBlock: SerializedBigNumber,
  claimStartDate: number,
  claimEndDate: number,
  claimDays:number[],
  claimPercents:number[],
  whitelistEnabled: boolean
}

const fetchPrivateSale = async (sale: SerializedPrivateSale): Promise<PublicPrivateSaleData> => {
  const { type, manager } = sale
  const contactAddress = getAddress(manager)
  const calls = [
    {
      address: contactAddress,
      name: 'presaleTokenPrice',
    },
    {
      address: contactAddress,
      name: 'startTime',
    },
    {
      address: contactAddress,
      name: 'endTime',
    },
    {
      address: contactAddress,
      name: 'startBlock',
    },
    {
      address: contactAddress,
      name: 'endBlock',
    },
    {
      address: contactAddress,
      name: 'claimStartTime',
    },
    {
      address: contactAddress,
      name: 'claimEndTime',
    },
    {
      address: contactAddress,
      name: 'getStages',
    },
    {
      address: contactAddress,
      name: 'whitelistEnabled',
    },
  ]

  const [presaleTokenPrice, startTime, endTime, startBlock, endBlock, claimStartTime, claimEndTime, stagesInfo, whitelistEnabled] =
    await multicall(presaleABI, calls)

  const claimDays = stagesInfo[0].map( (day) => new BigNumber(day).toNumber())
  const claimPercents = stagesInfo[0].map( (percent) => new BigNumber(percent).toNumber())
  
  return {
    price: new BigNumber(1e18).div(new BigNumber(presaleTokenPrice)).toNumber(),
    startDate: new BigNumber(startTime).toNumber(),
    endDate: new BigNumber(endTime).toNumber(),
    startBlock: new BigNumber(startBlock).toJSON(),
    endBlock: new BigNumber(endBlock).toJSON(),
    claimStartDate: new BigNumber(claimStartTime).toNumber(),
    claimEndDate: new BigNumber(claimEndTime).toNumber(),
    claimDays,
    claimPercents,
    whitelistEnabled: whitelistEnabled[0]
  }
}

export default fetchPrivateSale

