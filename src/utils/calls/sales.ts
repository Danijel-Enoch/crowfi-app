import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { AddressZero } from '@ethersproject/constants'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const buySale = async (manager, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await manager.buy(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const claimSale = async (manager, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await manager.claim(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}